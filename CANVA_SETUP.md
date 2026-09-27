# Canva Integration Setup Guide — AI Etsy Seller OS

This document provides instructions for configuring and deploying the official **Canva Connect API** integration for **AI Etsy Seller OS**.

---

## 1. Overview & Capabilities

AI Etsy Seller OS integrates with Canva through official Canva Connect API capabilities:
- **Canva OAuth 2.0 with PKCE (Proof Key for Code Exchange)** for secure user authorization.
- **Canva Studio Workspace** with pre-configured Etsy listing image sequences, Pinterest pins, Instagram stories, and promotional banners.
- **AI Design Content Generator & Copywriter** powered by Gemini to formulate titles, subheadings, bullet points, and visual guidance tailored for Etsy mobile shoppers.
- **Brand Kit Syncing** (colors, typography pairings, brand voice) passed directly into design briefs.
- **Cloud Firestore Storage** of design references isolated by workspace.

---

## 2. Registering Your Canva Developer App

1. Visit the [Canva Developers Portal](https://www.canva.com/developers/).
2. Sign in with your Canva account and navigate to **Your Integrations** → **Create an integration**.
3. Fill in your application metadata:
   - **Integration Name:** `AI Etsy Seller OS`
   - **Description:** `AI-assisted visual design and listing graphics generator for Etsy shop owners.`
4. Under **Authentication & OAuth 2.0**:
   - Enable **Authorization Code Grant with PKCE** (`S256`).
   - Copy your **Client ID** and **Client Secret**.

---

## 3. Configuring Redirect URIs

Add the following Redirect URIs in your Canva Developer integration settings:

### Local Development
```
http://localhost:3000/api/canva/callback
```

### Production / AI Studio Deployment
```
https://<YOUR_APPLET_DOMAIN>.run.app/api/canva/callback
```

> **Note on Iframe Safety:** AI Studio runs inside a secure iframe. As per OAuth best practices, our client initiates authentication in an independent popup window that hits Canva's authorization URL directly. When the user approves permissions, Canva redirects to `/api/canva/callback`, which posts a secure `postMessage` back to the parent app window and automatically closes.

---

## 4. Required Canva Scopes

Configure the minimum necessary permissions in the Canva Developer Portal:

| Scope | Description |
|---|---|
| `design:content:read` | Read design metadata and preview assets |
| `design:content:write` | Create and edit designs within user's Canva workspace |
| `design:meta:read` | Retrieve design dimensions and status |
| `asset:read` | Access uploaded product photographs |
| `asset:write` | Upload Etsy Seller OS images directly to Canva |
| `profile:read` | Read basic user display name for connection verification |
| `brandtemplate:content:read` | Read supported brand templates |
| `brandtemplate:meta:read` | Inspect brand template configurations |

---

## 5. Environment Variables Configuration

Copy `.env.local.example` to `.env.local` or set these in your hosting environment:

```env
# Canva OAuth 2.0 Credentials (Server-side only — never expose to client)
CANVA_CLIENT_ID="your_canva_client_id_here"
CANVA_CLIENT_SECRET="your_canva_client_secret_here"
CANVA_REDIRECT_URI="https://your-app-domain.run.app/api/canva/callback"

# Server Host URL (Injected automatically in AI Studio)
APP_URL="https://your-app-domain.run.app"

# Gemini AI API Key (Used for formulating design briefs and slide sequences)
GEMINI_API_KEY="your_gemini_api_key_here"
```

---

## 6. Architecture & Security Model

```
+----------------------------------------------------+
|               AI Etsy Seller OS                    |
|                                                    |
|  [Select Etsy Product] -> [AI Generates 6 Slides]  |
|                         |                          |
|                         v                          |
|             [Generate Canva Brief]                 |
|                         |                          |
|                         v                          |
|      +--------------------------------------+      |
|      |    Official Canva Connect API /      |      |
|      |         Canva Layout Intent          |      |
|      +--------------------------------------+      |
|                         |                          |
|                         v                          |
|        [Persist Reference in Firestore]            |
|       workspaces/{wsId}/canvaDesigns/{id}          |
+----------------------------------------------------+
```

### Key Security Safeguards
1. **No Client-Side Secrets:** `CANVA_CLIENT_SECRET` and OAuth tokens are strictly stored in server memory / secure Firestore collections and never delivered to browser clients.
2. **Workspace Isolation:** All Canva design references are organized under `workspaces/{workspaceId}/canvaDesigns/{designId}` and strictly protected by Firestore Security Rules.
3. **No Password Storage:** The app never asks for or stores Canva user passwords.

---

## 7. Known Canva Developer Platform API Constraints & Supported Workflows

When working with Canva's developer platform, observe the following official constraints:

1. **Design Export Rate Limits:** Canva restricts automated high-frequency asset export jobs on free developer tiers. For rapid production, users can edit in Canva and download at 2700x2025px PNG.
2. **Custom Fonts in Brand Kits:** Third-party Canva API calls cannot inject arbitrary unlicensed TTF/OTF files into user accounts. We recommend standard Canva-supported Google font pairings (e.g., *Playfair Display*, *Inter*, *Montserrat*, *Cormorant Garamond*).
3. **Automated Scraping Prohibition:** In accordance with Canva's Terms of Use, AI Etsy Seller OS never scrapes Canva web assets, avoids unofficial browser automation, and only interacts with official developer endpoints.

---

## 8. Troubleshooting

### Problem: OAuth popup is blocked by the browser
- **Cause:** Web browsers block popups that are not triggered by a direct user tap.
- **Fix:** Ensure the user clicks the "Connect Canva" button directly. Enable popups for your app domain if prompted.

### Problem: "Redirect URI mismatch" error on Canva
- **Cause:** The Redirect URI configured in the Canva Developer Portal does not match the current app domain.
- **Fix:** In Canva Developer Portal, verify that `CANVA_REDIRECT_URI` matches your exact preview URL (e.g., `https://ais-dev-...run.app/api/canva/callback`).

### Problem: Text in Canva thumbnails looks small
- **Cause:** Etsy listing thumbnails are frequently viewed on small smartphone screens (150px zoom).
- **Fix:** Use the AI Design Assistant's Quality Score suggestions to keep text sizes at 32pt+ and limit overlays to 20% of hero image area.
