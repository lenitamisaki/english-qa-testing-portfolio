import http from 'k6/http';
import { check, sleep } from 'k6';

// Critical flow: ATIVAR PREMIUM — POST to the redeem_premium_code RPC, the
// backend call the "Ativar Premium" button triggers.
//
// setup() logs in ONCE (a single request, not per-VU) and every virtual
// user reuses that same session token — the load this script generates
// lands entirely on the redeem_premium_code endpoint, not on the auth
// endpoint (already covered by login.k6.js). Every iteration submits an
// obviously-invalid code, so this never touches (or consumes) the real
// activation coupon.
//
// Conservative by default on purpose — see login.k6.js and the repo
// README's "Responsible testing note" for why.

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
    { duration: '10s', target: Number(__ENV.VUS || 5) },
    { duration: '20s', target: Number(__ENV.VUS || 5) },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500'],
    http_req_failed: ['rate<0.01'],
  },
};

export function setup() {
  const res = http.post(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    JSON.stringify({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD }),
    { headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY } }
  );
  const token = JSON.parse(res.body).access_token;
  if (!token) {
    throw new Error(`setup() login failed: ${res.status} ${res.body}`);
  }
  return { token };
}

export default function (data) {
  const res = http.post(
    `${SUPABASE_URL}/rest/v1/rpc/redeem_premium_code`,
    JSON.stringify({ _code: `PERFTEST-${__VU}-${__ITER}` }),
    {
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${data.token}`,
      },
    }
  );

  check(res, {
    'status is 200': (r) => r.status === 200,
    'returns a boolean (false, code does not exist)': (r) => r.body === 'false' || r.body === 'true',
  });

  sleep(1);
}
