# Design Notes

## Backlog

### Monthly operating cost estimate

As of 2026-05-03, with the current architecture and up to 1,000 posts per month, a realistic commercial operating budget is roughly USD 45-55/month.

Assumptions:

- Vercel hosts the Next.js app and Web Analytics.
- Supabase handles database, auth, and screenshot storage.
- Gemini analyzes each uploaded screenshot once.
- Apple App Store icon/CDN requests are not a direct billable service for this project.
- Each final stored screenshot is compressed WebP, roughly 0.2-0.8 MB.

Estimated monthly costs:

- Vercel Pro: about USD 20/month.
- Supabase Pro: about USD 25/month.
- Gemini API: likely under a few USD/month for 1,000 screenshot analyses.
- Vercel Web Analytics: USD 0-3/month at small traffic levels.
- Supabase storage and egress overage: usually USD 0 at small traffic levels, but image views are the main scaling risk.

Cost risk to watch:

- Storage egress from screenshot views can grow faster than post count.
- Vercel Analytics events can grow with page views.
- Gemini model pricing can change, especially because the current model is a preview model.

If traffic grows, review Supabase egress, storage size, Vercel analytics events, and Gemini usage before optimizing UI decoration requests such as app icon backdrops.

### Upload pre-validation

Keep the current server-side validation as the source of truth. A future client-side pre-check could improve the upload experience by catching obvious issues immediately after file selection.

Potential checks:

- Reject unsupported image types before upload.
- Warn or reject images with a non-home-screen-like aspect ratio, such as `width / height >= 0.7`.
- Warn for very large files before upload.
- Warn for images with low resolution that may reduce AI analysis quality.
- Reinforce the existing reminder to avoid screenshots containing notifications, contact details, location data, or photo thumbnails.

Do not rely on client-side checks for final safety or correctness. The server-side validation and AI home-screen check should remain authoritative.
