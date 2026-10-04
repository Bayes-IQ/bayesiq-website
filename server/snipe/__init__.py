"""snipe-sales.bayes-iq.com, served by this Railway service (Bayes-IQ/bayesiq-website#95).

Operator notes:
- Environment: SNIPE_HOST, SNIPE_DATA_DIR (a Railway volume; keep one replica), SNIPE_API_TOKEN,
  SNIPE_SESSION_SECRET, SNIPE_OPERATOR_EMAIL, RESEND_API_KEY, optional SNIPE_FROM_EMAIL. Any of the
  first five missing makes every snipe route except /robots.txt answer 503; with SNIPE_HOST unset the
  snipe app is unreachable and the audit API is unchanged.
- The site keeps the newest 90 sweep bundles. Pruned bundles are not authoritative: estate-scout holds
  the sweep history, and a bundle is re-derived by re-running `site_cli bundle` and `site_cli push`.
- Swipes are the only data that originates here; `site_cli pull-swipes` copies them back.
- Rotating SNIPE_SESSION_SECRET signs every device out (and voids unused sign-in links).
"""

from snipe.app import SnipeHostMiddleware, snipe_app

__all__ = ["SnipeHostMiddleware", "snipe_app"]
