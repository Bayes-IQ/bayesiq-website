# Data Quality Self-Assessment Tool — Product Definition

Last Updated: 2026-03-05

## Purpose

Source-of-truth for the interactive "Data Quality Self-Assessment" on `/assessment`. All UI copy, question text, answer choices, scoring logic, tier labels, recommendation copy, and CTA text derives from this document. No ad-hoc marketing copy should appear in TSX.

---

## Target Persona

**Product or data leads** (Director/VP of Data, Head of Product Analytics, Data Engineering Lead) evaluating whether their telemetry and analytics infrastructure is trustworthy. They are:

- Technically fluent but time-constrained.
- Aware something might be wrong with their data — but unsure how bad it is or where to start.
- Evaluating whether to invest in an external audit vs. fixing things internally.

**Intent:** Self-diagnosis and prioritization. The assessment gives them a directional signal and positions BayesIQ as the expert who can go deeper.

---

## Questions

The assessment consists of 6 questions. Each question has 4 answer choices scored 0–3 (0 = most at-risk, 3 = healthiest). Max possible score: 18.

### Q1 — Metric Consistency

**Question:** When two dashboards show the same business metric, how often do they agree?

| Choice | Score |
|--------|-------|
| They frequently disagree — we've given up reconciling | 0 |
| They sometimes disagree and it takes real effort to explain why | 1 |
| They usually agree, with occasional unexplained gaps | 2 |
| They always agree — we can explain every difference | 3 |

### Q2 — Telemetry Coverage

**Question:** How confident are you that your key telemetry events are firing correctly in production?

| Choice | Score |
|--------|-------|
| Not confident — we've found missing or wrong events before | 0 |
| Somewhat confident — we do spot checks but no systematic validation | 1 |
| Fairly confident — we have some automated checks | 2 |
| Very confident — we validate against a spec with automated tests | 3 |

### Q3 — Pipeline Observability

**Question:** When a data pipeline fails or produces bad output, how quickly do you find out?

| Choice | Score |
|--------|-------|
| We find out from a downstream stakeholder or a broken dashboard | 0 |
| We have some alerting but gaps — issues slip through | 1 |
| We have alerting on most critical paths | 2 |
| We have end-to-end monitoring with SLOs and automated recovery | 3 |

### Q4 — Metric Definitions

**Question:** How well-defined are your core business metrics?

| Choice | Score |
|--------|-------|
| Different teams use different definitions for the same metric | 0 |
| Definitions exist in a wiki but aren't enforced in queries or dashboards | 1 |
| Definitions are documented and mostly consistent across teams | 2 |
| Definitions are codified in a metrics layer with version control | 3 |

### Q5 — Incident History

**Question:** In the last 6 months, how many times did a data quality issue affect a decision, report, or external deliverable?

| Choice | Score |
|--------|-------|
| 3 or more times | 0 |
| Twice | 1 |
| Once | 2 |
| Never (that we know of) | 3 |

### Q6 — Data Trust

**Question:** How much do your stakeholders trust the data they see in dashboards and reports?

| Choice | Score |
|--------|-------|
| Low trust — teams routinely question numbers and build their own shadow reports | 0 |
| Mixed — some dashboards are trusted, others are questioned | 1 |
| Generally trusted — isolated concerns only | 2 |
| High trust — data is used confidently to make decisions | 3 |

---

## Scoring Rubric

| Raw Score | Percentage | Tier |
|-----------|------------|------|
| 0–6 | 0–33% | at_risk |
| 7–12 | 38–67% | needs_work |
| 13–18 | 72–100% | strong |

### Score band display

Rather than displaying the raw number, display the score as a percentage band rounded to the nearest 5%:

- **At Risk:** 0–35%
- **Needs Work:** 35–70%
- **Strong:** 70–100%

---

## Tier Labels and Descriptions

### At Risk

**Label:** At Risk
**Tagline:** Your data has significant reliability gaps that are likely affecting decisions today.
**Description:** The signals across your answers suggest your data infrastructure has real, compounding problems — inconsistent metrics, gaps in telemetry validation, and low stakeholder trust. This isn't a failure of effort; it's a structural problem that gets harder to fix the longer it compounds. The good news: these issues are findable and fixable with a systematic audit.

### Needs Work

**Label:** Needs Work
**Tagline:** Your data foundation is functional but has meaningful gaps worth addressing.
**Description:** You have the right instincts — you're doing some validation, you care about metric consistency — but there are gaps that create risk. Issues are slipping through, definitions aren't fully enforced, or trust is inconsistent across teams. Addressing the highest-risk gaps now prevents them from becoming serious problems.

### Strong

**Label:** Strong
**Tagline:** Your data infrastructure shows real maturity. Protect what's working.
**Description:** Your answers indicate a data organization that treats data quality seriously — codified metrics, automated validation, proactive monitoring. The risk at this stage isn't foundational failure but drift: as your product and team grow, coverage gaps open. Periodic audits catch what daily operations miss.

---

## Recommendations per Tier

### At Risk Recommendations

1. **Audit your metric definitions first.** If different teams run different queries for "conversion rate" or "DAU," no amount of tooling will fix the disagreement. Start by documenting what each metric means and where it's computed.
2. **Find one dashboard that everyone trusts and trace it backwards.** Understand exactly how it's built. That becomes your baseline.
3. **Run a telemetry audit against your logging spec.** If you don't have a logging spec, write one — even a rough one — and compare it against what actually fires.
4. **Set up alerting on your most critical pipeline steps.** You shouldn't find out about pipeline failures from a broken dashboard.
5. **Prioritize a professional audit.** At this level of data risk, the return on investment from a systematic audit is high — both in direct cost savings and in restoring stakeholder trust.

### Needs Work Recommendations

1. **Close the gap between documented definitions and enforced definitions.** If your metrics layer doesn't reflect what's in the wiki, stakeholders will keep doing their own math.
2. **Extend your telemetry validation to cover more events systematically.** Spot checks catch the obvious; automated checks catch the subtle and the intermittent.
3. **Review pipeline alerting coverage.** Map every critical data path and check whether there's monitoring on each one. The gaps are usually obvious once you look.
4. **Formalize one metrics review process** — even a quarterly review of your top 10 metrics catches drift before it compounds.
5. **Consider a targeted audit** on your highest-risk area (telemetry validation, pipeline observability, or metric definition consistency) rather than trying to improve everything at once.

### Strong Recommendations

1. **Schedule a periodic external audit.** Internal teams develop blind spots. An external review catches structural issues that are invisible from inside.
2. **Check whether your monitoring has kept up with product growth.** New features, new events, new teams — coverage degrades unless someone actively maintains it.
3. **Validate that your metrics layer definitions match stakeholder mental models.** Even a well-built metrics layer can have definition drift if product strategy has evolved.
4. **Consider publishing an internal data quality standard** — a written bar for what "good" looks like in your organization, used during code review and incident retros.
5. **Look at cross-team consistency.** Strong central infrastructure doesn't guarantee teams are all using it the same way.

---

## Next-Step CTA Copy

### Primary CTA (all tiers)

**Button text:** Talk to an expert
**URL:** /contact
**Context:** Placed below recommendations.

### Secondary CTA (all tiers)

**Button text:** See how audits work
**URL:** /approach
**Context:** Softer option for visitors not ready to contact.

### Results screen header CTA subtext

**At Risk:** "A BayesIQ audit will identify the exact issues and give you a prioritized fix plan — typically in under two weeks."
**Needs Work:** "A targeted BayesIQ review will identify the highest-risk gaps and give you a concrete plan for closing them."
**Strong:** "Even mature data organizations benefit from a periodic external review. We'll tell you what to watch for as you scale."

### Email capture value proposition

**Heading:** Get the full checklist
**Body:** Enter your email to get the complete Data Quality Checklist — the same framework BayesIQ uses when starting a new engagement.
**Button text:** Send me the checklist
**Privacy note:** No spam. Unsubscribe anytime. Read our [Privacy Policy](/privacy).

---

## Disclaimers

The following disclaimers must appear on the results screen:

1. **Directional score:** "This score is directional — based on your self-reported answers, not a technical audit of your actual systems. Use it as a starting point, not a definitive assessment."
2. **Not a compliance audit:** "This assessment is not a compliance audit and does not evaluate regulatory requirements (e.g., GDPR, CCPA, HIPAA)."

---

## Page Structure (for implementer reference)

### Hero

- **Headline:** Is your data actually reliable?
- **Subheadline:** Answer 6 questions and find out where your data infrastructure stands — and what to do about it.
- **Time to complete:** ~2 minutes
- **What you get:** A score, a tier assessment, and actionable recommendations tailored to your answers.

### FAQ

**Q: Is this a real audit?**
A: No — it's a self-assessment based on your answers to 6 questions. Think of it as a structured way to identify the highest-risk areas in your data infrastructure. A real audit involves examining your actual telemetry, pipelines, and metric definitions.

**Q: Who is this for?**
A: Data leads, analytics engineers, and product leaders who are responsible for the reliability of business metrics and analytics pipelines. If you're not sure whether your data is trustworthy, this is a good place to start.

**Q: How is the score calculated?**
A: Each answer is scored on a 0–3 scale based on data quality maturity. The total is converted to a percentage and mapped to one of three tiers: At Risk, Needs Work, or Strong.

**Q: What happens after I complete the assessment?**
A: You'll see your score, tier, and 3–5 specific recommendations. You can optionally enter your email to receive the complete Data Quality Checklist that BayesIQ uses when starting new engagements.

### What BayesIQ looks for (credibility block)

When we begin a data quality engagement, we evaluate six dimensions:

1. **Metric consistency** — do all your tools and queries agree on what a metric means and how to compute it?
2. **Telemetry accuracy** — do your events fire correctly, with the right properties, in all conditions?
3. **Pipeline observability** — do you know when something breaks, or do you find out from a broken dashboard?
4. **Definition enforcement** — are your metric definitions written down and actually used, or just aspirational?
5. **Incident history** — how often has a data quality issue caused a visible problem?
6. **Stakeholder trust** — do the people using your data trust it enough to make decisions from it?

These six dimensions are exactly what this assessment measures.
