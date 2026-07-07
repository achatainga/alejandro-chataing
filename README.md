# Alejandro Chataing — Interactive Portfolio & CV

> Live: **[alejandro-chataing.vercel.app](https://alejandro-chataing.vercel.app)**

Professional PWA portfolio and interactive resume for **Alejandro Chataing Avila** — Senior Full-Stack Engineer & AI-Augmented Tech Lead. Author of [mcp-code-context](https://www.npmjs.com/package/mcp-code-context).

## Features

- **PWA** — installable on mobile and desktop, offline support via Service Worker
- **Interactive Terminal** — run `help`, `whoami`, `mcp-status`, `ai-stack`, `skills`, `contact`
- **AST Visualizer** — live demo of mcp-code-context parsing code in real time
- **Bilingual** — full EN / ES toggle (URL param `?lang=es` supported)
- **Hire Me form** — EmailJS + Cloudinary file attachment upload
- **PDF Export** — pixel-perfect 2-page professional resume via `window.print()`
- **Secret Admin Panel** — `Ctrl+Shift+A` or 5× logo click → JSON editor + Gemini AI tailoring
- **Parallax canvas background** — animated logistics network

## Stack

- React 18 + TypeScript + Vite + Tailwind CSS
- Framer Motion — animations
- EmailJS — contact form email delivery
- Cloudinary — file attachment storage (free tier)
- PWA — manifest + service worker

## Local Development

```bash
git clone git@github.com:achatainga/alejandro-chataing.git
cd alejandro-chataing
npm install
cp .env.example .env   # fill in your keys
npm run dev
```

## Environment Variables

```bash
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
```

Set these in Vercel → Project Settings → Environment Variables.

## Cloudinary Setup

1. [cloudinary.com](https://cloudinary.com) → Settings → Upload → Upload Presets
2. Add preset: name `portfolio_attachments`, Signing mode: **Unsigned**, folder `hire-me`

## EmailJS Setup

1. [emailjs.com](https://www.emailjs.com) → Add Service (Gmail)
2. Create template with variables: `{{from_name}}`, `{{from_company}}`, `{{reply_to}}`, `{{phone}}`, `{{message}}`, `{{attachment_name}}`, `{{attachment_url}}`
3. Get Service ID, Template ID, Public Key → add to Vercel env vars

## Deploy

Push to GitHub → import in [vercel.com](https://vercel.com) → set env vars → deploy.

```bash
npm run build   # verify build passes before pushing
```

## Author

**Alejandro Chataing Avila**
[github.com/achatainga](https://github.com/achatainga) · [linkedin.com/in/alejandro-chataing-90205a1b1](https://www.linkedin.com/in/alejandro-chataing-90205a1b1) · [npmjs.com/package/mcp-code-context](https://www.npmjs.com/package/mcp-code-context)
