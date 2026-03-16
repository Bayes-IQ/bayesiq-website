# Dogfood Feedback — 2026-03-16

Golden flows demo review ahead of CTO review.

---

1. **Hospital "View in Dashboard" link shows "this site can't be reached"** — artifact link pointing to a dead/unreachable URL. Need to check `artifact_links.json` for hospital and verify URLs are valid or swap for placeholder.

2. **Real Estate selector card slightly taller than other verticals on maximized desktop** — likely longer text content causing uneven card heights. Need to fix with uniform card height (e.g., `min-h` or `line-clamp` on description text).

3. **Feedback threads expose internal project details** — showing PR numbers and internal tooling references (e.g., "PR #27 static data loader"). These are pipeline evaluation feedback items, not client-facing content. Either filter out internal/pipeline feedback or replace with demo-appropriate content.

4. **Retail "View in Dashboard" link doesn't load either** — same issue as hospital (#1). Likely all artifact dashboard links are dead. Need to audit all verticals' `artifact_links.json` URLs.

5. **Fintech "Questions Executives Are Asking" buttons not clickable** — buttons render but don't respond to clicks. Works in other verticals (hospital, saas, etc.). Likely a data issue with fintech's `executive_questions.json` or `cascade_data.json` — cascade data may be missing or malformed for fintech, preventing the AskAndCascadeSection from rendering the interactive version.

6. **No reporting surfaces (GDocs, dashboards) visible anywhere** — the demo doesn't show any actual report artifacts. No embedded GDocs, no dashboard screenshots, no downloadable reports. This feels disconnected from the `standing_up_demos.md` goal. The `published_docs` payload has no exporter and no data. The `artifact_links.json` URLs are dead. The demo shows governance metadata *about* reports but never shows an actual report. Need to either: (a) embed real GDoc report previews / screenshots, (b) link to actual standing demo reports, or (c) create placeholder report assets that convey what a real engagement delivers.

