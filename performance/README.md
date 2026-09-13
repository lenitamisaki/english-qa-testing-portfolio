# Performance testing

Covers QAZ-23 (Login), QAZ-27 (Ativar Premium) and QAZ-67 (Falar com Max).

## Tool

**k6** (`brew install k6`). Chosen over JMeter because scripts are plain JS —
consistent with the rest of the stack (Playwright/Node) — and it's scriptable
in CI without a JVM or a GUI project file.

## Critical flows identified

Found by inspecting the app's network traffic (Playwright), not by guessing —
these are the actual backend calls each screen's primary action triggers.
Page shells themselves are static assets on a CDN and aren't a meaningful load
target, so each script exercises the real backend call instead:

| Screen | Critical call | Script |
|---|---|---|
| Login | `POST /auth/v1/token?grant_type=password` (Supabase Auth) | `login.k6.js` |
| Ativar Premium | `POST /rest/v1/rpc/redeem_premium_code` (Supabase RPC) | `premium.k6.js` |
| Falar com Max | Unknown — **blocked**, see below | — |

"Falar com Max" is gated behind premium (see `docs/test-strategy.md` and
QAZ-66); its network calls were never observed because the test account
can't reach that screen yet. Once premium is activated, capture the chat
endpoint with the browser network tab / Playwright first, then add a
`chat.k6.js` following the same pattern as `premium.k6.js`.

## Target load

Deliberately conservative: 5 virtual users, ramped up over 10s, held for 20s,
ramped down over 5s (~200-300 requests total per script). This app runs on
shared, third-party infrastructure (Supabase + hosting) we don't own — this
is a **load** check (does it hold up under light, realistic concurrency?),
not a **stress** test (push until it breaks). Actually finding the breaking
point means deliberately degrading someone else's production service, which
needs the same authorized-scope agreement the README's "Responsible testing
note" already requires for offensive security scenarios. Don't raise
`VUS`/duration past a light check without that.

`premium.k6.js` logs in once in `setup()` and reuses that token across every
VU, so the load lands on the redeem endpoint being measured, not on the auth
endpoint (already covered separately by `login.k6.js`). Every iteration
submits an obviously-invalid code — it never touches or consumes the real
activation coupon.

## Running

```bash
cd performance
TEST_USER_EMAIL=... TEST_USER_PASSWORD=... k6 run login.k6.js
TEST_USER_EMAIL=... TEST_USER_PASSWORD=... k6 run premium.k6.js
```

Optional: `VUS=<n>` to override the default 5 virtual users.

## Results

| Screen | Date | VUs | p95 response time | Error rate | Notes |
|---|---|---|---|---|---|
| Login | 2026-09-13 | 5 | 738ms | 57% | **Bottleneck found**, see below |
| Ativar Premium | 2026-09-13 | 5 | 600ms | 0% | Healthy — no errors, comfortably under the 1.5s threshold |
| Falar com Max | | | | | Blocked — see above |

### Gargalo: Login (QAZ-23)

Under 5 sustained VUs for 35s (~110 requests), the auth endpoint failed 57%
of the time — but the failures aren't the app's fault. A handful of manual
sequential and concurrent requests right after the run all succeeded
immediately, and the failure rate climbed *as the run went on*, which is the
signature of a request-count-based rate limiter rather than a capacity
problem: Supabase's GoTrue auth service enforces its own default rate limits
on the `/auth/v1/token` endpoint, independent of whatever the app's frontend
does. Sustained automated login traffic at this app's current Supabase tier
will get throttled well before 5 req/s.

This isn't something the app's own code can fix — it's a platform limit.
Worth flagging to whoever owns the Supabase project: either the rate limit
config needs raising for load-testing purposes, or real-world concurrent
login capacity is capped at whatever that limit allows. Not investigated
further to avoid eating more of the rate-limit budget for the rest of the
day (see "Responsible testing note").
