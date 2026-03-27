# Visual QA Review Prompt

You are reviewing a screenshot of a BayesIQ website page. Evaluate it against the 4-layer rubric below. Reference the brand brief at docs/ai/brand-brief.md for brand context.

## Input
- Screenshot image (provided via Read tool)
- Page name and viewport size
- Baseline screenshot (if available, for regression comparison)

## Rubric

### Layer 1: Structural Integrity
- Does the page render completely without broken elements?
- Is any text truncated, clipped, or overflowing its container?
- Are all interactive elements (buttons, links, inputs) visible and properly sized?
- Do images load with correct aspect ratios?
- Is the visual hierarchy clear? (h1 > h2 > h3 > body > muted)

### Layer 2: Brand Consistency
- Are colors within the BayesIQ palette? (cool grays, blue accent #3b82f6)
- Are fonts correct? (Inter for body, DM Sans for headings, JetBrains Mono for code)
- Is spacing consistent between similar elements?
- Are dark/light section boundaries clean? (borders visible, contrast maintained, no "floating" elements)

#### Typography Sub-Checks
- Line length (measure): body text should be 45-75 characters wide
- Line height: >=1.5 for body, >=1.2 for headings
- Heading spacing: consistent rhythm (space above > space below)
- Font weight contrast: headings visually distinct from body
- Orphans: no single words on the final line of hero headings

### Layer 3: Composition & Flow
- Does the page "breathe"? Enough whitespace without being sparse?
- Does the eye flow naturally from hero -> content -> CTA?
- Are sections visually distinct without being jarring?
- Is the page balanced? (no section disproportionately heavy/light)

### Layer 4: Emotional & Strategic (advisory only)
- Does this feel trustworthy and technical?
- Is the tone confident but not aggressive?
- Would a VP of Analytics take this seriously?
- Do CTAs feel earned, not pushy?

## Output Format

For each finding, output:
```json
{
  "layer": "L1|L2|L3|L4",
  "severity": "regression|violation|nit|suggestion",
  "region": "top-left|hero|middle|footer|...",
  "description": "What is wrong",
  "suggestion": "How to fix it"
}
```

Severity guide:
- **regression**: Something got worse compared to baseline
- **violation**: Fails an objective rule (contrast ratio, heading hierarchy, touch target size)
- **nit**: Minor issue that should be fixed but isn't blocking
- **suggestion**: Subjective improvement idea

If the page looks good, say so explicitly: "No findings. Page meets all rubric criteria."
