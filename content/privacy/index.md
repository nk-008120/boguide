---
title: "Privacy Policy"
---

**Last updated:** October 11, 2026

BiOGuide is a free, non-commercial study resource. Almost everything on the site - every topic page, every practice question, every timed attempt - works with no account at all. This page explains what happens on the small part that does involve an account: login, your profile, and the leaderboard.

## What we collect

If you never create an account, we don't collect anything about you beyond standard, anonymous web hosting logs (handled by our host, Vercel).

If you create an account (optional, via **Sign Up** on the [Account page](/account/)), we collect:

- **Email and password** - used to log you in, and your email is also used for the occasional service announcement described under "Why we collect it" below. Passwords are never stored in readable form; authentication is handled by our backend provider, Supabase, using industry-standard hashing. We never see or store your raw password.
- **Display name** - chosen at signup, shown publicly on the leaderboard.
- **Avatar** - a picture you pick from a small curated set, shown publicly next to your name.
- **Country, education level, and a short "about" bio** - all optional, filled in on your profile. Country is shown publicly on the leaderboard as a flag; education level and "about" are shown only on your own profile.
- **Timed Attempt / quiz activity** - if you submit a practice test to the leaderboard, we store your score, timing, and per-question results, tied to your account, so we can rank you and show your history.
- **Doubts you post** - the title, subject, text, and any photos you attach to a question on the [Doubts page](/doubts/). Doubts and the staff replies to them are public to any visitor, shown with your display name, avatar, and country. Photos are re-encoded before upload, which strips EXIF metadata, the same way BiOLab photos are.
- **Paper contributions and corrections** - if you send us a past paper, a correction, or a solution through the [contribute form](/papers/contribute/), we store what you typed and any PDF you uploaded so staff can review it. These are visible only to you and to BiOGuide staff.
- **Page ratings and study progress** - a rating you give a notes page, and the review schedule the Dashboard keeps for the topics you practise. Ratings are shown only as an average across all users; your review schedule is visible only to you.

BiOLab, BiOClash, and BiOLive collect a little more when you use them, and each has its own section further down. We don't collect payment information (the site is free), and we don't run advertising scripts or sell data to advertisers. We do use analytics tools to understand traffic and how the site is used, described in the Analytics section below.

## Why we collect it

Only to run the features you're actually using: logging you in, showing your chosen name/avatar/country on the leaderboard, and keeping a record of your practice-test results so the leaderboard and your own history stay accurate.

We may also email account holders an occasional **service announcement**: a new feature or programme on BiOGuide (for example the launch of BiOLive), a change to your account or to this policy, or something you signed up for, such as a BiOClash round or a BiOLive session. These are sent by the BiOGuide team, they are infrequent, and they never contain third-party advertising. Every announcement says how to stop receiving them; you can also email us at any time and we will take you off the list. Messages needed to run your account or a session you registered for (sign-in codes, password resets, a Zoom link) are still sent.

We don't sell data, and we don't use it for advertising.

## Where it's stored

Account and profile data lives in [Supabase](https://supabase.com), a hosted Postgres database and authentication provider. The site itself is hosted on [Vercel](https://vercel.com). Both are reputable infrastructure providers used by many websites - naming them here is normal and doesn't mean either can see or use your data beyond storing/serving it on our behalf.

Row-level security rules mean other logged-in users can never read your email or your private practice-test details directly from the database - only what's meant to be public (display name, avatar, country, leaderboard results) is visible to others.

## Other services your browser contacts

A few parts of a page are loaded from services we don't run. They don't receive your account details, but like any website they see your IP address and which file was requested:

- **flagcdn.com** - the small country flag images shown next to names on leaderboards, doubts, and BiOLab.
- **cdn.plot.ly and cdn.jsdelivr.net** - the charting and maths libraries used by some interactive widgets on notes pages. We pin the exact file and verify it before it runs.
- **Sentry** - if one of our server functions fails, the error is reported to Sentry so we can fix it. Reports contain the error and which function failed, not your profile.

The library that talks to Supabase is served from our own site, not from a third party.

## Accounts are optional

You can read every topic page and attempt every practice question without ever signing up. An account only unlocks saving leaderboard results, a profile, full access to BiOBytes articles, and registering for BiOLive sessions.

## Cookies and local storage

Your login session is kept in your browser's local storage, not a cookie, so you stay logged in between visits - this is standard behavior for any site with accounts, not a tracking mechanism. Google Analytics 4 sets first-party cookies to recognize return visits; PostHog is configured to use local storage only, not cookies. Neither is used for advertising, and we don't run ad-targeting scripts of any kind.

## Analytics

We use three tools to understand how the site is used. None of them sell data or run advertising:

- **Umami** (self-hosted, on our own infrastructure) - anonymous page views and Core Web Vitals. No cookies, no personal data. This is also what powers the visitor-country counts on the [About page](/about/#community-reach).
- **PostHog** (hosted in the EU) - tracks a small set of specific actions, like completing signup or submitting a practice attempt, not full page content or recordings of your session. If you're logged in, these actions are linked to your account so we can understand how account holders actually use the site; if you're not logged in, they're anonymous.
- **Google Analytics 4** - standard traffic and behavior analytics, using the first-party cookies described above. You can opt out at any time using [Google's browser add-on](https://tools.google.com/dlpage/gaoptout) or by enabling Do Not Track in your browser.

## BiOLab: protocols, results, and feedback

[BiOLab](/biolab/) is different from the rest of the site: it's the one place where content you submit can be shown publicly to **any visitor**, not just other logged-in BiOGuide members. If you use BiOLab, here's specifically what that means:

- **Protocols you submit** (title, category, description, the full protocol text, and any source attribution you provide) publish immediately and are shown to any visitor of the archive, logged in or not - there is no staff review queue before it goes live. Your display name, avatar, and country are shown as the author, the same way they appear on the leaderboard.
- **Feedback/comments you leave** on a protocol are public to any visitor, attributed to your display name the same way.
- **Results you submit** against a protocol (a numeric value, unit, and optional photo) are **private by default** - visible only to you. They only become visible to other visitors if you explicitly choose "Make public" on that result. Making a result public also makes any photo attached to it visible to others; keeping it private keeps the photo visible only to you.
- **Photos you attach to a result** are re-encoded before upload, which strips EXIF metadata (GPS location, device model, capture timestamp) automatically - we never store that metadata. This is separate from what's *in the frame*: the submission form asks you not to include your face, other people, or identifying surroundings in the photo itself, since stripping EXIF data doesn't change what the image visually shows.
- **Reporting and removal:** any protocol or result can be reported by another logged-in user. If BiOGuide staff act on a report, the content is hidden from public view (a removal flag, checked before anything is ever shown publicly) rather than deleted outright, so we retain an internal record of what was reported, why, and what was done about it. A removed protocol or result is no longer visible to anyone except (where applicable) the person who submitted it.

If you'd rather not have something you submitted to BiOLab shown publicly, the simplest option is not to submit it, or to keep a result private and never toggle it public. If you want a public protocol, feedback comment, or public result removed, email us at the address below and we'll take it down.

## BiOClash: attempts and recordings

[BiOClash](/bioclash/) rounds are timed and verified, so taking part involves a few things beyond a normal practice attempt:

- **Attempt data** - your answers, timings, extension use, and integrity signals such as fullscreen exits and tab-visibility losses are stored against your account so your round can be graded and ranked.
- **Your recording and scratch paper** - participants are asked to record themselves with their front camera during an attempt and to photograph or scan their scratch paper. These files are **not uploaded to BiOGuide**. You keep them in your own Google Drive and send us links to them through a submission form, sharing them with a BiOGuide reviewer account as a viewer (or with "Anyone with the link can view" if your school account blocks that).
- **How we use them** - BiOGuide staff open the links only to verify that your attempt followed the rules. We do not download, copy, or keep the files. We keep the submitted links and the form responses (your username, the links, and any feedback you wrote) until the round's results are announced and verification is complete, and then delete them.
- **Your control** - because the files live in your Drive, you can revoke access or delete them at any time. Once results are announced we ask you to delete them yourself. If you remove access before verification finishes, your result may stay unverified.
- **Who sees what** - the public leaderboard shows only your display name, avatar, country, and placement. Recordings and scratch paper are never published.

## BiOLive: session registrations

[BiOLive](/live/) is our weekend programme of live paper solving on Zoom. If you register for a session, here is what that involves:

- **What you give us** - the name you enter, your target olympiad, and an optional doubt or question for the host. Your account email is attached to the registration automatically.
- **Who sees it** - only BiOGuide staff, and only to run the session: the host uses your email to send you the Zoom link. Other students never see your name, email, or question. The public calendar shows only how many students have registered for a session, never who.
- **Attendance** - after a session, staff may mark whether you attended. This is visible to you and to staff only.
- **Zoom** - the session itself runs on Zoom, a third-party service with its own privacy policy. The Zoom link is sent by email and is not stored on BiOGuide. A session may be recorded by the host and shared by email with the students registered for it; the host will say so at the start.
- **Your control** - you can pull out of a session any time before it starts, which deletes that registration. Deleting your account removes all of your registrations.

## Deleting your data

If you have an account, you can delete it yourself at any time: log in, go to the [Account page](/account/), and use **Delete my account** at the bottom of your profile. This permanently and immediately removes your login, profile, avatar/country/education/about, all leaderboard/attempt history, your doubts, your BiOLab results and feedback, your contributions, and your BiOLive registrations - it cannot be undone. The files you uploaded go with them: result photos, doubt photos, and contributed PDFs are deleted from storage before the account is removed, and if that step fails the deletion stops so nothing is left half done.

One thing stays: a **BiOLab protocol you published** remains in the archive, with its attachments, but with your name, avatar, and country removed from it. Protocols are shared reference material that other students may already be working from. If you want a protocol taken down as well, email us before or after deleting and we'll remove it. We keep a minimal internal record that a deletion occurred (just a date and an internal ID, nothing identifying) so we can confirm a deletion happened if you ever ask us to check.

If you'd rather we do it for you, or you have any other privacy question, email us at **r6394175@gmail.com**.

## A note for younger users

BiOGuide's audience includes a lot of school-age students. If you're under the age required in your country to agree to this kind of policy on your own (for example, under 13 in the US), please ask a parent or guardian to help you sign up, or to reach out to us at the email above with any questions or a deletion request on your behalf.

## Changes to this policy

If this policy changes in any meaningful way, we'll update the "Last updated" date at the top of this page. Since BiOGuide is run by one person rather than a legal team, treat this as a clear, honest first pass rather than a final legal document - if you have concerns, please just email us.

## Contact

**r6394175@gmail.com**
