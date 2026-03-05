# Deploy Checklist — Manual Steps

These steps migrate from Squarespace and connect the site to external services. All services use free tiers. Do them in order.

---

## 0. Migrate domain from Squarespace to Vercel

Do this first. Everything else depends on having DNS control.

### Transfer the domain out of Squarespace

1. Log in to Squarespace → **Settings** → **Domains** → **bayes-iq.com**
2. Click **Transfer away from Squarespace** (or **Manage domain settings** → **Transfer**)
3. Unlock the domain if locked
4. Copy the **authorization/EPP code** Squarespace provides
5. Go to your new registrar — **Cloudflare** (free) or **Namecheap** (~$10/year) — and start a domain transfer
6. Paste the auth code when prompted
7. Approve the transfer confirmation email
8. Wait for transfer to complete (can take up to 5 days, usually 1–2)

**Important:** Do NOT cancel Squarespace until the domain transfer is complete. If you cancel first, you may lose access to the domain management panel.

### Add the domain to Vercel

1. Go to your Vercel project → **Settings** → **Domains**
2. Add `bayes-iq.com`
3. Vercel will show you the DNS records to set:
   - `A` record: `76.76.21.21` (for the apex domain `bayes-iq.com`)
   - `CNAME` record: `cname.vercel-dns.com` (for `www.bayes-iq.com`, if you want www to work)
4. Add these records at your new registrar's DNS settings
5. Vercel will auto-provision an SSL certificate once DNS propagates (usually < 1 hour)

### Verify the site is live

1. Open `https://bayes-iq.com` in a browser — you should see your Next.js site
2. Open `https://www.bayes-iq.com` — should redirect to the apex domain
3. If you see a Vercel 404 or the old Squarespace site, wait for DNS propagation (check with `dig bayes-iq.com` or https://dnschecker.org)

### Cancel Squarespace

Once `bayes-iq.com` loads your Vercel site:

1. Go to Squarespace → **Settings** → **Account** → **Cancel subscription**
2. Confirm cancellation

---

## 1. Resend (contact form + newsletter)

### Create account and API key

1. Go to https://resend.com and sign up
2. Verify your email
3. Go to **API Keys** → **Create API Key**
   - Name: `biq-website-production`
   - Permission: `Full access`
   - Copy the key — you won't see it again

### Verify your sending domain

1. Go to **Domains** → **Add Domain**
2. Enter `bayes-iq.com`
3. Resend will give you DNS records to add (MX, SPF, DKIM)
4. Add those records at the same registrar you transferred the domain to in step 0
5. Wait for verification (usually < 1 hour)

Until the domain is verified, emails will come from Resend's shared domain and may land in spam.

### Create a newsletter audience

1. Go to **Audiences** → **Create Audience**
   - Name: `BayesIQ Newsletter`
2. Copy the **Audience ID** (shown on the audience detail page)

### Set env vars on Vercel

Go to your Vercel project → **Settings** → **Environment Variables** and add:

| Variable | Value | Notes |
|----------|-------|-------|
| `RESEND_API_KEY` | `re_xxxxxxxx` | The API key you created |
| `RESEND_AUDIENCE_ID` | `aud_xxxxxxxx` | From the audience detail page |
| `CONTACT_TO_EMAIL` | `hello@bayes-iq.com` | Where contact form submissions go (defaults to this if not set) |
| `CONTACT_FROM_EMAIL` | `website@bayes-iq.com` | Sender address (must match verified domain) |

Set all four for **Production**, **Preview**, and **Development** environments.

---

## 2. Calendly (booking widget)

### Create account and event type

1. Go to https://calendly.com and sign up with your work email
2. Create an event type:
   - Name: `Data Quality Consultation` (or similar)
   - Duration: 30 minutes
   - Location: Zoom / Google Meet / whatever you prefer
3. Go to your event type page and copy the URL — it looks like `https://calendly.com/bayesiq/30min`

### Set env var on Vercel

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_CALENDLY_URL` | `https://calendly.com/bayesiq/30min` | Your event type URL |

This is a `NEXT_PUBLIC_` variable so it's available client-side. If not set, the component falls back to `https://calendly.com/bayesiq/30min`.

---

## 3. Google Search Console (SEO)

### Verify domain ownership

1. Go to https://search.google.com/search-console
2. Click **Add Property** → choose **URL prefix** → enter `https://bayes-iq.com`
3. Verify ownership using one of:
   - **DNS TXT record** (recommended) — add the TXT record Provided by Google to your domain's DNS
   - **HTML file** — download the verification file and place it in `/public/` in the repo, then redeploy

### Submit sitemap

1. After verification, go to **Sitemaps** in the left nav
2. Enter `https://bayes-iq.com/sitemap.xml` and click **Submit**
3. Google will start crawling within a few days

---

## 4. Redeploy

After setting all env vars on Vercel:

1. Go to your Vercel project → **Deployments**
2. Find the latest deployment → click the three dots → **Redeploy**
3. This picks up the new env vars

Or push any commit — the env vars take effect on the next build.

---

## Verification

After redeployment, confirm everything works:

- [ ] Submit the contact form on `/contact` — check that an email arrives at `hello@bayes-iq.com`
- [ ] Subscribe to the newsletter in the footer — check that a contact appears in your Resend audience
- [ ] Load `/contact` and confirm the Calendly widget renders with available time slots
- [ ] Check Google Search Console — sitemap status should show "Success" within a few days
- [ ] Run a Lighthouse audit on the production URL — confirm Performance ≥ 90, SEO ≥ 90

---

## Local development

For local dev, create a `.env.local` file (already in `.gitignore`):

```
RESEND_API_KEY=re_xxxxxxxx
RESEND_AUDIENCE_ID=aud_xxxxxxxx
CONTACT_TO_EMAIL=your-personal-email@example.com
CONTACT_FROM_EMAIL=website@bayes-iq.com
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/bayesiq/30min
```

Use your personal email for `CONTACT_TO_EMAIL` during development so you can test form submissions without spamming the shared inbox.
