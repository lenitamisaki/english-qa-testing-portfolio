# Test Strategy

## Objective

Validate three high-value screens of the English QA web app across functional, security and
AI-quality dimensions, using a risk-based, shift-left approach aligned with ISTQB CT-STE and
CT-AI v2.0.

## Levels and types of testing

- **Functional testing** — does the feature work? Happy paths, negative paths, boundaries,
  empty/malformed input, state transitions (session lifecycle).
- **Security testing (CT-STE)** — does the feature resist attack? Derived from the security
  properties (Confidentiality, Integrity, Availability, Authentication, Authorization).
- **AI testing (CT-AI v2.0)** — for the LLM assistant, where there is no single correct answer:
  metamorphic relations, robustness, bias/fairness, toxicity and hallucination.

## Test design techniques used

- Equivalence partitioning and boundary value analysis (input validation)
- State transition testing (authenticated ↔ unauthenticated, session expiry)
- Risk-based prioritization (impact × likelihood)
- Metamorphic testing (AI, to address the oracle problem)
- Exploratory testing (session-based, to seed the scenarios above)

## Shift-left

Security and quality are considered from requirements, not only at the end. Each user story is
expected to carry security acceptance criteria (e.g. "premium content must be validated
server-side"). This is documented so reviewers can see the intent early.

## BDD and living documentation

Scenarios are written in Gherkin (`Dado / Quando / Então`) and tagged:

- `@funcional` — functional behavior
- `@seguranca` — security (CT-STE); executed only in authorized scope
- `@ct_ai` — AI-specific properties (CT-AI v2.0)

Tags allow selective execution (e.g. run `@funcional` in CI, keep `@seguranca` for the authorized
environment) and keep the feature files as living documentation.

## Automation approach *(next phase)*

- **Stack:** Cypress or Playwright (JavaScript/TypeScript), aligned with BDD
- **Architecture:** Page Object Model, isolated test data, reusable steps
- **CI:** pipeline running `@funcional` on every push; reports published as artifacts
- **Rationale:** functional and regression scenarios are automated first; security and AI checks
  remain partly manual/exploratory where human judgment is required

## Environment and responsible testing

Offensive security scenarios require an **authorized scope agreed in writing** with the product
owners (rules of engagement). This protects both the tester and the product and is treated as a
first-class deliverable.

## Metrics

Tracked continuously (see `metrics.md`): scenarios designed per screen and type, defects opened
by severity, defects resolved vs. pending, and automation coverage.
