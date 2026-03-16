# PR#37 — Replace Dead Dashboard Links with Screenshot Previews

Last Updated: 2026-03-16

PR Type:
- [x] Website (biq_website)

---

## Goal

Replace broken "View in Dashboard" links in DiscoverInsights with inline screenshot previews from `screenshot_manifest.json`. Currently these links point to unreachable hosts. Instead, show users what the dashboard looks like via the screenshots the DAK already generates.

---

## Data Shape

`public/golden-flows/{vertical}/screenshot_manifest.json`:
```json
{
  "schema_version": "1.0.0",
  "payload_type": "screenshot_manifest",
  "vertical": "hospital",
  "screenshots": [
    {
      "id": "dashboard_overview",
      "label": "Dashboard Overview",
      "url": "https://...",
      "type": "dashboard",
      "description": "..."
    }
  ]
}
```

Need to verify: are the screenshot URLs valid (hosted images) or also dead?

---

## Implementation

### 1. Check screenshot URL validity

Before building the component, verify that `screenshot_manifest.json` URLs resolve to actual images. If they're also dead, we need to either:
- (a) Host screenshot images in `public/golden-flows/{vertical}/screenshots/`
- (b) Generate placeholder screenshots
- (c) Skip this PR and fold the fix into PR#38 (report surfaces)

### 2. ScreenshotPreview component (if URLs valid)

```tsx
interface ScreenshotPreviewProps {
  screenshot: {
    id: string;
    label: string;
    url: string;
    type: string;
    description?: string;
  };
}
```

- Render as a card with the image, label, and description
- Click to expand full-size in a `<dialog>` lightbox (reuse dialog pattern from GovernanceDetailPanel)
- Fallback: if image fails to load, show a placeholder with the label

### 3. Modify DiscoverInsights.tsx

Replace the `<a href={insight.dashboard_link}>View in dashboard →</a>` with:
- If `screenshot_manifest` has a matching screenshot for this insight: render `<ScreenshotPreview>`
- If no screenshot available: remove the dead link entirely (don't show a broken link)

### 4. Wire screenshot_manifest into the vertical page

`getScreenshotManifest(slug)` already exists in `golden-flows.ts`. Pass the data to DiscoverInsights as an optional prop.

---

## Test Plan

1. Hospital DiscoverInsights: no "View in Dashboard" link that goes to dead URL
2. If screenshots exist: preview images render inline, click opens lightbox
3. If no screenshots: link is simply absent (no broken link, no empty state)
4. `npm run build` passes
5. Existing e2e tests pass

---

## Exit Criteria

- [ ] No dead "View in Dashboard" links on any vertical
- [ ] Screenshot previews render when manifest data exists
- [ ] Lightbox opens on click, closes on Escape/backdrop
- [ ] Graceful fallback when no screenshots available
- [ ] All existing tests pass
