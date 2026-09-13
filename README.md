# English QA — Security & AI Testing Portfolio

![BDD](https://img.shields.io/badge/BDD-Gherkin-43A047)
![ISTQB CT--STE](https://img.shields.io/badge/ISTQB-CT--STE-1976D2)
![ISTQB CT--AI](https://img.shields.io/badge/ISTQB-CT--AI%20v2.0-6A1B9A)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

QA engineering case study on a real language-learning web application, focused on
**risk-based security testing (ISTQB CT-STE)** and **AI testing (ISTQB CT-AI v2.0)**.

> This repository documents my testing process end to end: from risk analysis and
> test design to BDD scenarios, defect reporting, automation and metrics — the way
> I would approach quality on a production product.

## Context

- **Application under test:** English QA (web app for learning English, with AI-powered features)
- **Role:** QA Engineer (volunteer program)
- **Scope of this case study:** three high-value screens — Authentication (Login),
  Premium activation (access control) and *Falar com Max* (an AI/LLM chat assistant)
- **Frameworks referenced:** ISTQB CT-STE (Security Test Engineer), ISTQB CT-AI v2.0 (AI Testing)

## Why these three screens

I prioritized by **risk = impact × likelihood**, not by convenience. Authentication was
selected as the highest-impact asset (a compromised login exposes every asset behind it),
Premium activation exercises **authorization** and **availability** (paid content and AI token
consumption), and the AI chat is the intersection of **security** (prompt injection, data
leakage) and **AI quality** (non-determinism, bias, hallucination). Full reasoning in
[`docs/risk-analysis.md`](docs/risk-analysis.md).

## What's inside

| Area | Where | What it shows |
|------|-------|---------------|
| Risk analysis | [`docs/risk-analysis.md`](docs/risk-analysis.md) | Asset → value → threat → security property (CT-STE mindset) |
| Test strategy | [`docs/test-strategy.md`](docs/test-strategy.md) | Risk-based, shift-left, BDD, automation and AI approach |
| BDD scenarios | [`features/*.feature`](features/) | Gherkin scenarios tagged `@funcional`, `@seguranca`, `@ct_ai` |
| Metrics | [`docs/metrics.md`](docs/metrics.md) | Coverage and defect metrics tracked throughout the project |
| Automation | [`tests/`](tests/) | Playwright + BDD step definitions for Login and Premium activation `@funcional` scenarios. "Falar com Max" is implemented but skips until the test account has premium access (see [`docs/test-strategy.md`](docs/test-strategy.md)) |
| CI | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) *(in progress)* | Pipeline running the automated checks |

## Repository structure

```
.
├── README.md
├── LICENSE
├── docs/
│   ├── risk-analysis.md
│   ├── test-strategy.md
│   └── metrics.md
├── features/
│   ├── login_autenticacao.feature
│   ├── ativar_premium.feature
│   └── falar_com_max.feature
├── tests/
│   ├── pages/          # page objects (auth, premium)
│   ├── steps/          # Gherkin step definitions
│   └── support/        # shared test helpers (auth session)
├── bug-reports/       # defect reports (next phase)
└── .github/workflows/ # CI pipeline (next phase)
```

## Running the automation suite

```bash
npm install
npx playwright install chromium
cp .env.example .env   # fill in BASE_URL, TEST_USER_EMAIL, TEST_USER_PASSWORD
npm test
```

`TEST_USER_EMAIL`/`TEST_USER_PASSWORD` must be a pre-registered, **email-confirmed**
account — Supabase (the auth provider behind this app) rejects login for accounts
created but never confirmed, so a freshly self-registered user won't work here.

The suite runs `@funcional` scenarios only. "Ativar premium com cupom válido" and
"Conteúdo premium fica visível após ativação" consume the real activation coupon on
whichever account you point the suite at — run those deliberately, not as part of a
routine `npm test`, unless you're using an account you don't mind activating. The
three "Falar com Max" scenarios are implemented but skip automatically until that
account has premium access, since the chat is gated behind it.

## Testing approach at a glance

1. **Start from risk, not from clicks.** Identify the asset each screen protects, its value,
   and the threats — then test where the risk is highest.
2. **Design functional coverage systematically** using equivalence partitioning, boundary
   values and state transition (session lifecycle).
3. **Derive security tests from properties** — Confidentiality, Integrity, Availability,
   Authentication, Authorization — asking "what breaks this here?".
4. **Test AI by relations, not fixed oracles** — metamorphic testing, robustness, bias,
   toxicity and hallucination checks for the LLM assistant.
5. **Report, measure, iterate** — every defect and scenario is tracked in Jira and reflected
   in the metrics.

## Responsible testing note

Offensive-flavored security scenarios (brute force, access-control bypass, prompt injection)
are documented as *test intent* and are only executed within an **authorized scope agreed in
writing** with the product owners. Rules of engagement are part of this portfolio by design —
security testing done ethically is the professional standard.

## Traceability

Scenarios and defects are tracked in Jira (project key `QAZ`); commits reference the related
Jira issue (e.g. `QAZ-1`) so the work stays traceable from requirement → test → defect → fix.

---

*Feature files are written in Portuguese (the product and team language). Documentation is in
English for international readers. English versions of the feature files can be provided on request.*
