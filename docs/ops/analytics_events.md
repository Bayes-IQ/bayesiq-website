# BayesIQ Website — Analytics Event Spec

Provider: Vercel Analytics (`@vercel/analytics`)

Page views are tracked automatically. Custom events use `track()` from `@vercel/analytics`.

## Event Taxonomy

| Event | Properties | Notes |
|-------|-----------|-------|
| `page_view` | `path` | Automatic via Vercel Analytics |
| `cta_click` | `location`: header, hero, services, approach, case-studies, footer | Tracks which CTAs drive contact page visits |
| `service_card_click` | `service_name`: string | Which services get attention on homepage |
| `case_study_expand` | `case_study_id`: string | Engagement depth on case studies page |
| `contact_submit_started` | — | User began filling out the form |
| `contact_submit_success` | — | Form submitted and email sent successfully |
| `contact_submit_error` | `error_type`: string | Debug form delivery issues |
| `blog_post_view` | `slug`: string | Content performance (added with blog infra PR#15) |
| `newsletter_signup_started` | — | User submitted the newsletter signup form |
| `newsletter_signup_success` | — | Email successfully added to Resend Audience |
| `newsletter_signup_error` | `error_type`: string | Signup failed; values: `invalid_email`, `config_error`, `resend_error`, `unknown` |

## Naming Conventions

- snake_case for event names
- snake_case for property keys
- String values for all properties (no numbers or booleans)

## Implementation Status

| Event | Implemented | PR |
|-------|-----------|-----|
| `page_view` | Yes (automatic) | #12 |
| `cta_click` | Pending | — |
| `service_card_click` | Pending | — |
| `case_study_expand` | Pending | — |
| `contact_submit_started` | Pending | #13 (with Resend) |
| `contact_submit_success` | Pending | #13 (with Resend) |
| `contact_submit_error` | Pending | #13 (with Resend) |
| `blog_post_view` | Pending | #15 (with blog infra) |
| `newsletter_signup_started` | Pending | #20 |
| `newsletter_signup_success` | Pending | #20 |
| `newsletter_signup_error` | Pending | #20 |
