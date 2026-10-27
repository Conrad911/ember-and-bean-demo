# Ember & Bean Coffee House — demo website

A polished, mobile-first demo website for a **fictional** neighbourhood coffee shop in Benoni, Gauteng.
Built as a sales demo by Conrad Joubert. All business details (address, phone, email, WhatsApp number, reviews) are placeholders.

- Pure HTML / CSS / vanilla JavaScript — no build step, no frameworks.
- All paths are **relative**, so it works at a domain root *and* under a GitHub Pages project subpath (`https://<user>.github.io/<repo>/`).
- Packaged as a Visual Studio solution with a tiny ASP.NET Core host so you can press **F5** to preview it.

## Folder layout

```
coffee-shop/
├─ EmberAndBean.sln                  ← open this in Visual Studio
├─ EmberAndBean.Web/
│  ├─ EmberAndBean.Web.csproj        ← ASP.NET Core empty project (net10.0)
│  ├─ Program.cs                     ← UseDefaultFiles + UseStaticFiles only
│  ├─ Properties/launchSettings.json
│  └─ wwwroot/                       ← THE WEBSITE (this is what gets published)
│     ├─ index.html, 404.html, .nojekyll
│     ├─ css/styles.css, js/main.js
│     ├─ assets/logo.svg, assets/logo-light.svg, assets/img/*.webp
│     └─ favicon.svg/.png/.ico, apple-touch-icon.png, site.webmanifest
└─ .github/workflows/deploy-pages.yml ← auto-deploys wwwroot to GitHub Pages
```

## Open and run in Visual Studio (2022 or 2026)

1. Requires the **.NET 10 SDK** (comes with Visual Studio 2026 / VS 18 with the *ASP.NET and web development* workload).
2. Double-click `EmberAndBean.sln`.
3. Press **F5** (or Ctrl+F5). The site opens in your browser at `http://localhost:5010` (or `https://localhost:7032` with the *https* profile).

> Using Visual Studio 2022 with only the .NET 9 SDK? Change `<TargetFramework>net10.0</TargetFramework>` to `net9.0` in `EmberAndBean.Web.csproj`.

Command line alternative:

```bash
cd EmberAndBean.Web
dotnet run
```

You can also just open `EmberAndBean.Web/wwwroot/index.html` directly in a browser — no server needed.

## Publish to GitHub Pages

1. Create a new GitHub repository (e.g. `ember-and-bean`) and push this folder to the `main` branch.
2. In the repo go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy-pages.yml`, which uploads `EmberAndBean.Web/wwwroot` and deploys it.
4. The site goes live at `https://<your-username>.github.io/<repo-name>/` (the link also shows on the workflow run).

The `.nojekyll` file stops GitHub from running Jekyll over the site.

## Customising for a real client

| What | Where |
| --- | --- |
| Business name, copy, menu & prices | `wwwroot/index.html` |
| Phone / email / WhatsApp number | `index.html` (search `000 0000` and `emberandbean.example`) and the two constants at the top of `wwwroot/js/main.js` |
| Opening hours | `index.html` (hours table, footer, JSON-LD) and `HOURS` in `js/main.js` (drives the "Open now" badge) |
| Colours & fonts | CSS variables at the top of `wwwroot/css/styles.css` |
| Map | the `<iframe>` in the *Visit* section — swap the `q=` query for the real address |
| Photos | replace files in `wwwroot/assets/img/` (keep under ~300 KB, `.webp` recommended) |
| Search engines | remove `<meta name="robots" content="noindex, nofollow">` from `index.html` when going live |

The enquiry form has no backend: it builds a message and opens **WhatsApp** (`wa.me`) or the visitor's **email app** (`mailto:`).

---
*Demo site by Conrad Joubert. Ember & Bean Coffee House is a fictional business; photos are AI-generated.*
