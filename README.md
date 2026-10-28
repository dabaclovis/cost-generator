# Bidwell

A responsive, dependency-free HTML/CSS/JavaScript proposal studio for commercial cleaning businesses. Optional PHP backend connects OpenAI. This is an MVP, not a paid SaaS with accounts or billing.

## Use immediately

Open `index.html` in a browser, or serve this directory from your existing web host. The free template studio works without API keys, PHP, npm, or a build step. Example → Create → edit → Save / Download / Print to PDF. Saved drafts are local to that browser, capped at the latest 50. Downloads are plain text; PDF uses the browser print dialog.

`sitemap.xml` lists the single public application URL. Replace `YOUR-DOMAIN-HERE` in that file with the production hostname before submitting the sitemap to search engines. The app has no separate crawlable routes; its workspace views are client-side sections.

For a local HTTP preview with PHP 8.1+: `php -S 127.0.0.1:8080`.

## Local bidding tools

- **Template library:** 12 searchable recurring-cleaning starting points cover offices, retail, coworking, fitness studios, tutoring centers, apartment common areas, community halls, warehouse offices, showrooms, restaurant front-of-house areas, salons, and financial branches. Search by property type or scope text. Each fills the studio with sample client details, notes, and a monthly placeholder price; verify and replace these before quoting. You can then choose Proposal, Follow-up, or Scope of work. Specialized and restricted work is excluded unless separately scoped and qualified.
- **Pricing calculator:** estimates monthly labor as staff-hours per visit × visits per week × 52 / 12 × loaded hourly labor cost. It adds monthly supplies, applies overhead to direct costs, then divides by (1 − target profit margin). Margin is not markup. Inputs are illustrative defaults; taxes are excluded. Choose **Use monthly price** to fill the studio price, then regenerate any existing draft to reflect it.
- **My proposals:** search titles, clients, and document text; filter by Draft, Sent, Won, or Lost. Rename changes the saved title, not the client or document. Duplicate creates a separate Draft. Status tracking never sends a document. Up to 50 proposals are retained; saving a new one at capacity requires deleting an existing one rather than silently discarding it.
- **Business details:** save your business name, contact name, email, phone, website, and address. New documents include these details. Existing documents are not automatically changed. Contacts are appended locally when generating; refinement sends the entire edited draft, including any contacts, to AI when connected.
- **Draft recovery:** unfinished notes, selected document type, client, price, tone, document edits, and refinement instructions recover after a refresh in the same browser. **New proposal** intentionally clears this workspace, without deleting saved proposals. Unavailable browser storage is reported in the interface.
- **Backup and restore:** under **My proposals**, export a versioned JSON backup of saved proposals and your profile. Keep backups private: they contain client and business data. Import accepts a valid Bidwell version 1 backup (maximum 10 MB, 50 proposals) and asks before replacing saved proposals and your profile. The open workspace remains an unsaved draft. Malformed files are rejected without changing existing data. The unfinished workspace is not included in exported backups; save your draft first.
- **Privacy → Clear all local data** removes saved proposals, the business profile, and recovered workspace data. None of these tools syncs data across devices.

## Activate AI and the sales contact

Configure these variables in the PHP server environment, outside the public web root:

- `OPENAI_API_KEY`: your OpenAI project API key. Never put it in frontend files.
- `OPENAI_MODEL`: a model available to your project supporting the Responses API.
- `BIDWELL_ORIGIN`: the exact deployed origin, e.g. `https://brotherfall.com` (no trailing slash).
- `BIDWELL_CONTACT_EMAIL`: your sales inbox; defaults to the user-supplied `info@application.com`. Activates the package inquiry mailto link.
- `BIDWELL_BOOKING_URL`: optional HTTPS booking URL, used if email is not set.

PHP 8.1+ with cURL and outbound HTTPS is needed for AI. The current public nginx host serves static files and does not execute PHP; configure a PHP-FPM handler for `api.php` (or proxy this endpoint to a PHP application server) before enabling AI. The built-in PHP server above is only for local development. API response format follows https://developers.openai.com/api/docs/guides/text . GET `api.php` returns public configuration only. POST calls the Responses API, with `store: false`. There is no API key input in the browser.

The MVP limits AI to 10 requests per IP per UTC day and 100 total per day on one server. Each response is capped at 1,800 output tokens. Rate data is stored in the system temporary directory outside the website. Set OpenAI project budget alerts/limits as available. Behind a reverse proxy, REMOTE_ADDR may be shared, so use trusted proxy IP handling before expanding access. Multi-server scaling needs a shared rate-limit store. There is no user authentication or subscription enforcement.

The contact button does not charge or silently submit anything. Package inquiries open an email to the user-supplied `info@application.com`; this inbox has not been independently verified. Confirm you can receive those inquiries and can deliver the advertised service before marketing it. No external deployment or DNS changes are performed by this project.

## Business and revenue plan

**Buyer:** Independent commercial cleaning owners bidding on offices, retail, and coworking properties.

**Problem:** Repeatedly writing proposals and follow-ups takes time, while unclear scope creates friction. Jobber's 2026 home-service survey lists communication and quoting among common time-consuming tasks: https://www.getjobber.com/home-service-trends-report/ . This is adjacent-market evidence, not proof of demand for this specific product. Existing estimating competitors mean specialization and personal service matter.

**Offer to validate:** $2,000 one-time setup: one customized proposal template, service/pricing worksheet, three follow-up templates, and a 60-minute handoff. This requires real delivery work beyond the free generator. Use this workspace as a useful demo and lead magnet. Interview 10 owners, then offer 3 paid pilot engagements with explicit delivery terms before scaling. Avoid fabricated testimonials or promised contract wins.

**$60,000 by December 31, 2026:** 30 clients × $2,000 = $60,000 gross collected revenue, not profit. From September 23, roughly 14 weeks remain, so the arithmetic requires about 2–3 paid clients per week. At an assumed 20% qualified-call-to-sale rate, this needs 150 qualified calls, about 11 per week. That conversion rate is a planning assumption, not a forecast. Work backwards from observed results, and account for acquisition costs, delivery hours, fees, refunds, and taxes. Net income of $60,000 would require more revenue.

**First week:** Talk to local cleaning owners, record their current bid workflow, customize one real sample with permission, validate the offer, and set up the contact destination and an invoicing/payment process. Do not spend heavily on ads before validating conversion. Ongoing weeks: measure inquiries → qualified calls → paid setups → delivery time → referrals. The website alone will not deliver the revenue goal.

## Limitations and launch checks

- The template mode is deterministic, clearly labeled, and works without AI.
- Live AI requires your server configuration and a paid API account; no live AI call is made without them.
- AI drafting/refinement, user accounts, billing, and email sending are distinct: only AI drafting/refinement is integrated here. The app does not send proposals or process payments.
- Visitors enter their own pricing. Example rates are not estimates. Review every output before sending.
- The Google Fonts stylesheet is optional; system fonts fall back if unavailable.
- Confirm HTTPS, PHP execution (not source serving), outbound API access, origin config, and the contact destination on your actual host before launch.

## Verification in this workspace

- HTML parsed; JavaScript syntax and PHP lint passed.
- Local PHP server returned HTTP 200 for the page, styles, script, and public configuration. Unconfigured AI requests correctly returned 503.
- Existing public host served the new app over HTTP at http://brotherfall.com. HTTPS refused the connection in this environment.
- Public nginx currently serves PHP as static content. No secrets are embedded in these files; AI remains off until PHP execution, HTTPS, and environment variables are configured.
- Headless browser functional checks passed: proposal generation with supplied price, draft saving/reopening and persistence after reload, follow-up and scope generation, three template choices, business-name customization, and the mailto inquiry destination.
- Desktop (1440px) and mobile (390px) screenshots inspected; no mobile horizontal overflow. No application errors reported by the browser. Live OpenAI calls were not tested because credentials are absent.
