# Design Process — Gate-Based Check-ins

This document captures the design check-in process for BayesIQ. The canonical process definition with full pass criteria lives at:

**`~/BayesIQCode/bayesiq-workspace/processes/design.md`**

This file is the narrative version — how we arrived at the gates and why they matter.

---

## The problem this solves

Without named gates, design review defaults to looking at finished artifacts and saying "not good" or "good enough." That's too late and too binary. The gates create earlier, cheaper check-ins where the most impactful corrections happen.

The biggest mistake newer builders make:

```text
idea → implementation plan → build → react to whatever comes out
```

The healthier process:

```text
problem → intended feeling → proof burden → structure → direction → build → cut → ship
```

---

## The five gates

### Gate 1: Problem & Direction

**Before designing anything.** Someone asks:

- What problem are we actually solving?
- For whom?
- What should they understand or feel after seeing this?

This is where Golden Flows work should have started: not "how do we clean up the page," but "what should a prospect understand about BayesIQ after seeing it?"

**Passes when:** The page job, proof burden, and emotional arc are defined.

### Gate 2: Narrative Architecture

**After rough structure, before visual work.** Check:

- Is the page architecture right?
- Are the sections in the right order?
- Are we leading with the right idea?
- Does each section make exactly one point?
- Are we overcomplicating it?

This is where teams catch big mistakes cheaply. The Golden Flows plan went through two rounds here — the first draft was a UI reshuffling, the second was a narrative repositioning.

**Passes when:** Section order tells a story, not just "components we have."

### Gate 3: Design Direction

**Once the polished direction exists, before engineers build:**

- Does this feel premium enough?
- Does it communicate the intended product story?
- Is the visual hierarchy strong?
- Is the direction concrete enough that two engineers would build similar things?

This is the gate before engineering spends real time.

**Passes when:** Implementation plan has PR sequence, component specs, design constraints, and guard rails.

### Gate 4: Build Fidelity + Cut

**After implementation starts.** Two checks in one pass:

1. **Fidelity:** Did the built version preserve the intent? Compare against the plan's emotional arc and section descriptions — each section should produce its intended feeling.
2. **Cut:** Apply the restraint test to every element: "Could I delete this and lose specific information?" If no, cut it.

This matters because many good designs die during implementation — either through clutter accumulation or intent drift.

**Passes when:** Each plan section maps to the built page, and nothing is there that doesn't earn its space.

### Gate 5: Launch Readiness

**Before exposing externally:**

- Would we proudly show this to a prospect?
- Any trust, copy, or quality risks?
- Is this consistent with the rest of the site?

If the page outgrows the rest of the site strategically, a follow-through plan for site-level alignment must be filed.

**Passes when:** All variants render, mobile works, no dead links, no placeholder content.

---

## Who approves at each gate

In big tech, different humans own different gates:

```text
PM / founder / product lead
  → approves problem framing and success criteria

Designer or design-minded lead
  → approves structure, hierarchy, and visual direction

Engineering lead
  → approves feasibility, sequencing, and implementation tradeoffs

Cross-functional review
  → approves launch readiness, polish, and trustworthiness
```

At a startup, you may play all four roles, but the gates still exist. You explicitly pause and ask the gate's question before moving on.

---

## Collapsibility

For small projects (< 1 day, no new pages or sections), gates 1 and 2 can merge into a single "problem + structure" check-in. Gates 3-5 remain separate for all projects.

---

## Gate records

Each gate check-in is stored as a markdown file:

```
<repo>/docs/ai/gates/<project-slug>/gate-<N>-<slug>.md
```

Example: `biq_website/docs/ai/gates/golden-flows-cleanup/gate-1-problem-direction.md`

Format:

```markdown
# Gate {N}: {Name} — {Project}

**Date:** YYYY-MM-DD
**Decision:** pass | pass-with-conditions | fail
**Reviewer:** {who}

## Evidence
{What was evaluated — link to plan, screenshot, built page, etc.}

## Notes
{What was discussed, what changed, conditions for pass.}

## Next gate
{What must happen before the next gate.}
```

---

## First project using this process

Golden Flows cleanup is the first project governed by these gates. Gate status and per-section checklists are tracked in the implementation plan:

**`docs/ai/pr_markdown_plans/golden-flows-cleanup.md` → "Design process gates" section**

Gates 1-3 passed on 2026-03-16 (problem framing → narrative architecture → design direction). Gate 4 is scheduled after PR 2; Gate 5 after PR 4.
