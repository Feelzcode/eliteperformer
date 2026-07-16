# Elite Performers Circle — Next.js

## Setup

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL, ADMIN_PASSWORD, Cloudinary, Resend
npx prisma migrate dev --name init
npx prisma db seed        # optional, if you add a seed script
npm run dev
```

Admin panel: `/admin` (redirects to `/admin/login` if not authenticated).

## What changed vs. the static HTML version, and why

**The "Export Code" panel is gone.** In the static version there was no
backend, so the admin panel's only option was to generate HTML/JSON the
person would copy-paste back into the site file. With a real database, that
step is unnecessary — the admin panel calls `PUT /api/content` and the
public page reads the same row at request time (revalidated every 60s). Hit
"Save changes" in the admin panel, the live site updates within a minute.

**Uploads go straight from the browser to Cloudinary.** `/api/upload` only
issues a short-lived signature — the file itself never touches our server.
Keeps large video files off our bandwidth and keeps the upload fast.

**Admin auth is a single shared password**, not a full user system —
appropriate for a one-or-two-person admin panel. `lib/auth.js` isolates this
decision; swap in NextAuth/Clerk later without touching the API routes,
since they all just call `requireAdmin(request)`.

## Loaders — where each one is used

| Loader | Used for | Where in this codebase |
|---|---|---|
| `Signal` | First load of a whole page/panel | `app/admin/page.js` while the initial `/api/content` fetch is in flight |
| `Arc` | Button actions | Save button, login submit, form submit — small spinner replacing button text |
| `Dots` | Media/open-ended wait | Inside photo/video/screenshot upload buttons while Cloudinary processes |
| `Bar` | Panel/route transitions | Top-of-viewport line when switching admin sidebar tabs |
| `Skeleton` | Tables/lists | Testimonial list placeholder shape before data resolves |

All five live in `components/ui/Loaders.jsx` + `loaders.css`. Toasts are a
separate system (`components/ui/Toast.jsx`) — call `useToast()` anywhere
inside `<ToastProvider>` (already wrapped around the whole app in
`app/layout.js`).

## What's fully wired vs. what's a porting stub

**Fully wired (real logic, not placeholder) — everything:**
- Prisma schema + Postgres
- Admin auth (login/logout/middleware)
- Content API (GET public, PUT admin-only)
- Cloudinary signed uploads
- Registration API → DB + Resend confirmation email
- All three admin panels (profile photo, homepage videos, testimonials) with
  real save/upload logic and the loader/toast system applied per the table
  above
- Admin dashboard (content health, pre-intake activity, EngageFoyer placeholder)
- `app/page.js` / `components/site/HomePage.jsx` — full port of
  `calvin-black-pink.html`: hero, stats, host bio, 3-step playbook,
  why-this-matters banner, both homepage videos (DB-backed), press strip,
  testimonial grid (DB-backed), 4-secrets section, FAQ accordion, closing
  CTA, sticky mobile CTA, and the registration modal — all ported to React
  state instead of vanilla DOM manipulation. Countdown ticker and
  scroll-reveal are separate client components (`Ticker.jsx`,
  `ScrollReveal.jsx`) so they can be reused.
- `app/thank-you/page.js` / `components/site/ThankYouPage.jsx` — full port
  of `thank-you-bridge.html`: welcome video block, calendar dropdown
  (Google/Outlook/Yahoo links + downloadable .ics for Apple Calendar), the
  full pre-intake form (wired to `/api/register`), pre-class checklist with
  the "I know sender" callout, FAQ video list, and testimonial video list.

Both pages pull their CSS from `components/site/home.css` and
`components/site/thankyou.css` — copied over near-verbatim from the
original `<style>` blocks so the visual result matches exactly.

**Genuinely still a stub:** the video blocks and FAQ/testimonial clips on
both pages render as styled placeholders (gradient background + caption)
when no CMS URL is set, same as the original static HTML — there was never
a real video file to embed, only a design for where one goes.

## EngageFoyer + Zoom

Webinar registration, branded confirmation/reminders, and Zoom sync belong
in EngageFoyer. Elite should POST to EngageFoyer's registration API and
redirect to `/thank-you` for pre-intake. Wire
`ENGAGEFOYER_APP_URL` / `ENGAGEFOYER_WEBINAR_ID` when ready.
