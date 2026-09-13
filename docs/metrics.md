# Metrics

Updated continuously so the final compilation is a sum, not an archaeology exercise.

## Scenarios designed

| Screen | @funcional | @seguranca | @ct_ai | Total |
|--------|-----------:|-----------:|-------:|------:|
| Login / Authentication | 6 | 8 | – | 14 |
| Premium activation | 5 | 7 | – | 12 |
| Falar com Max (AI) | 3 | 5 | 8 | 16 |
| **Total** | **14** | **20** | **8** | **42** |

## Defects

| Metric | Value |
|--------|------:|
| Opened (total) | _fill in_ |
| Critical / High | _fill in_ |
| Medium / Low | _fill in_ |
| Resolved | _fill in_ |
| Pending | _fill in_ |
| Resolution rate | _fill in_ |

## Defects by screen

| Screen | Opened | Resolved | Pending |
|--------|-------:|---------:|--------:|
| Login | | | |
| Premium | | | |
| Falar com Max | | | |

## Automation coverage

| Screen | Scenarios (@funcional) | Automated | % |
|--------|----------:|----------:|--:|
| Login | 6 | 6 | 100% |
| Premium | 5 | 5 (2 gated behind manual run — see README) | 100% |
| Falar com Max | 3 | 3 (skip until account has premium) | 100%¹ |

¹ Step definitions exist and run, but assert nothing meaningful yet since the
screen is inaccessible without premium — they self-skip rather than fail.
@seguranca and @ct_ai scenarios remain manual/exploratory for now, per the
automation approach in `test-strategy.md`.

## Notes

- Severity scale and definitions: _document your scale (e.g. Critical/High/Medium/Low)._
- Update this file whenever a scenario is added or a defect changes status.
