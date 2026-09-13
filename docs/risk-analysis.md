# Security Risk Analysis (CT-STE)

Risk-based approach: for each screen, identify the **asset** to protect, its **value**, the
**security property** in play, the **threats**, and the resulting **test intent**. This is the
starting point of security testing — you test where the risk is highest, not where it's easiest.

Risk is assessed as **impact × likelihood**. High-impact assets are prioritized even when the
likelihood is only moderate.

## Security properties reference

| Property | Protects against | Example of a break |
|----------|------------------|--------------------|
| Confidentiality | Seeing what you shouldn't | Reading another user's private AI chat |
| Integrity | Altering what you shouldn't | Changing your own status from free to premium |
| Availability | Degrading / taking down the service | Exhausting AI tokens until the app fails |
| Authentication | Proving *who you are* | Taking over another user's account |
| Authorization | Proving *what you may do* | Consuming premium content without paying |

## Screen 1 — Login / Authentication (QAZ-1)

- **Asset:** the user identity/account — the door to private data (AI chats), progress and premium access
- **Value:** high — personal data (privacy/LGPD) and system reputation
- **Property in play:** Authentication (foundation of Authorization)
- **Threats:** weak passwords, brute force, user enumeration, injection, poor session management
- **Impact if it fails:** account takeover; unauthorized access to private conversations
- **Test intent:** password policy, brute-force protection, generic error messages, injection/XSS
  handling, secure transport (HTTPS), session expiry, protection of internal routes
- **Priority:** **highest** — a compromised login cascades to every other asset

## Screen 2 — Premium activation (QAZ-2)

- **Asset:** paid content **and** the application's AI resources/tokens
- **Value:** high — it is the product's revenue and carries real operational cost per use
- **Properties in play:** Authorization (primary) and Availability
- **Threats:** premium bypass, free→premium status tampering, coupon brute force, token abuse
- **Impact if it fails:** financial loss (unpaid usage + token cost) and possible service degradation
- **Test intent:** direct-URL access to premium resources, request/status tampering, server-side
  validation, coupon rate limiting, single-use coupon reuse, per-user usage limits

## Screen 3 — Falar com Max / AI chat (QAZ-13)

- **Assets:** the user's private conversations + the model's behavior (its rules) + response adequacy
- **Value:** high — sensitive personal data (extortion/LGPD risk) and integrity of the AI service
- **Properties in play:** Confidentiality (conversations), Authorization (what Max may do/reveal),
  and AI-specific characteristics (robustness, absence of bias)
- **Threats:** conversation leakage, prompt injection/jailbreak, hallucination, toxic or biased output
- **Impact if it fails:** exposure of private data (blackmail, LGPD), AI doing what it shouldn't,
  reputational damage
- **Test intent:** isolation between users' conversations, prompt-injection resistance, behavior under
  adversarial input, metamorphic consistency checks

## Prioritization summary

| Screen | Impact | Likelihood note | Priority |
|--------|--------|-----------------|----------|
| Login | Very high (cascades) | Moderate (usually hardened) | 1 |
| Premium | High (revenue + tokens) | Moderate–high (newer control) | 2 |
| Falar com Max | High (privacy + AI) | Moderate–high (LLM risks are new) | 3 |

Login wins on impact despite likely being the most hardened — when the blast radius is the whole
system, high impact outweighs a lower likelihood.
