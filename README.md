# GE HealthCare Frontend - Client Deployment Guide

This document explains how to build and deploy the `ge-healthcare-frontend` project on a client server.

## 1) Project Overview

- Frontend stack: React + Vite
- Type: Single Page Application (SPA)
- Auth/session: token and user data stored in browser `localStorage`
- API connectivity: controlled through `VITE_API_URL`

## 2) Prerequisites

- Node.js 20.x or later
- npm 10.x or later (comes with recent Node.js)
- A running backend API reachable from the client server
- Web server for static hosting (Nginx or Apache, or equivalent)

## 3) Environment Configuration

Create a `.env` file in the project root (same level as `package.json`).

Use this format:

```env
VITE_API_URL=https://your-backend-domain.com
```

Notes:
- Do not keep `localhost` in production.
- Do not add a trailing slash to `VITE_API_URL`.
- Frontend requests are sent to:
  - `/api/login`
  - `/api/forgot-password`
  - `/api/verify-reset-token`
  - `/api/reset-password`
  - `/api/users`

## 4) Install and Build

Run these commands from the `ge-healthcare-frontend` folder:

```bash
npm install
npm run build
```

Build output is generated in:

```text
dist/
```

## 5) What to Upload to Server

Upload the **contents of `dist/`** to the web server document root.

Example:
- Nginx root: `/var/www/ge-healthcare-frontend`
- Apache root: `/var/www/html/` (or your configured virtual host path)

## 6) Required SPA Routing Configuration

Because this is a React SPA, direct URL access (for example `/login`, `/admin/users`, `/ecg-holter`) must be rewritten to `index.html`.

### Nginx Example

```nginx
server {
    listen 80;
    server_name your-frontend-domain.com;

    root /var/www/ge-healthcare-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Apache (.htaccess) Example

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## 7) Post-Deployment Verification Checklist

After deployment, verify:

- Frontend loads successfully on root URL (`/`)
- Login page opens (`/login`)
- Forgot password page opens (`/forgot-password`)
- Reset password flow opens with token URL (`/reset-password?token=...`)
- API calls succeed from browser network tab (no CORS or 404 issues)
- Protected routes redirect correctly when not logged in
- Admin route (`/admin/users`) works only for admin user

## 8) Common Issues and Fixes

- Blank page after deployment:
  - Ensure server is serving `index.html` from uploaded `dist/` content.
- 404 on route refresh:
  - Missing SPA rewrite rules. Add Nginx/Apache rewrite as above.
- API errors from frontend:
  - Verify correct `VITE_API_URL` at build time.
  - Confirm backend is reachable from deployed frontend domain.
  - Check CORS settings on backend.

## 9) Local Development (Optional)

If client needs local testing:

```bash
npm install
npm run dev
```

Default Vite dev server runs on:

```text
http://localhost:5173
```
