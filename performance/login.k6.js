import http from 'k6/http';
import { check, sleep } from 'k6';

// Critical flow: LOGIN — POST to the Supabase auth token endpoint, the
// backend call the "Entrar" button triggers. This is the piece of the
// screen that actually does work under load (the SPA shell itself is a
// static asset served from a CDN and isn't a meaningful load target).
//
// Conservative by default on purpose: this app runs on shared, third-party
// infrastructure we don't own (Supabase project + hosting), so this is a
// light "load" check (steady low concurrency, short duration), not a
// breaking "stress" test. Raising VUS/DURATION to actually find the
// breaking point needs sign-off from the app's owners first — see the
// "Responsible testing note" in the repo README.

const SUPABASE_URL = __ENV.SUPABASE_URL || 'https://bwmnismzmjjyrvbacoyi.supabase.co';
const SUPABASE_ANON_KEY =
  __ENV.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3bW5pc216bWpqeXJ2YmFjb3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTYzNjUsImV4cCI6MjA3NjAzMjM2NX0.t_xWzTwMR_6iooiZ3G41dajtXFhiksvc5uUsxKQ_GDs';
const TEST_USER_EMAIL = __ENV.TEST_USER_EMAIL;
const TEST_USER_PASSWORD = __ENV.TEST_USER_PASSWORD;

if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
  throw new Error('Set TEST_USER_EMAIL and TEST_USER_PASSWORD env vars before running.');
}

export const options = {
  stages: [
    { duration: '10s', target: Number(__ENV.VUS || 5) }, // ramp up
    { duration: '20s', target: Number(__ENV.VUS || 5) }, // hold
    { duration: '5s', target: 0 }, // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.post(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    JSON.stringify({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD }),
    {
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
      },
    }
  );

  check(res, {
    'status is 200': (r) => r.status === 200,
    'returns access_token': (r) => {
      try {
        return !!JSON.parse(r.body).access_token;
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
