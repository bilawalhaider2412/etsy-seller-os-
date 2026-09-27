# Firebase Setup & Deployment Guide — AI Etsy Seller OS

This guide outlines how to configure, deploy, and manage the production Firebase backend for **Etsy Seller OS**.

---

## 1. Provisioned Firebase Project Details

The project is provisioned with Google Cloud / Firebase:
* **Firebase Project ID:** `crucial-sunspot-qvxch`
* **Web App ID:** `1:138237569291:web:5c1dc690481e3c04591a0e`
* **Firestore Database ID:** `ai-studio-etsyselleros-ad65299e-61fe-46c3-825a-400f6274dfd4`
* **Storage Bucket:** `crucial-sunspot-qvxch.firebasestorage.app`
* **Auth Domain:** `crucial-sunspot-qvxch.firebaseapp.com`

---

## 2. Authentication Configuration

1. In the [Firebase Console](https://console.firebase.google.com/project/crucial-sunspot-qvxch/authentication), navigate to **Authentication > Sign-in method**.
2. **Email/Password**: Enable both **Email/Password** and **Email link (passwordless sign-in)** (optional).
3. **Google Sign-In**: Enable Google and select the support email.
4. **Authorized Domains**: Ensure your production domain and `localhost` are listed under **Settings > Authorized domains**.

---

## 3. Cloud Firestore Setup

1. In the Firebase Console, go to **Firestore Database**.
2. Verify database `ai-studio-etsyselleros-ad65299e-61fe-46c3-825a-400f6274dfd4` (or default database) is in **Production mode**.
3. Deploy security rules from `firestore.rules`:
   ```bash
   firebase deploy --only firestore:rules
   ```
4. Deploy indexes from `firestore.indexes.json`:
   ```bash
   firebase deploy --only firestore:indexes
   ```

---

## 4. Firebase Storage Configuration

1. In the Firebase Console, navigate to **Storage**.
2. Verify default bucket: `crucial-sunspot-qvxch.firebasestorage.app`.
3. Deploy storage rules from `storage.rules`:
   ```bash
   firebase deploy --only storage
   ```

---

## 5. Security Architecture & Multi-Tenant Workspaces

Data is modeled with strict multi-tenant workspace isolation:
* `users/{uid}` — Private user profiles (only readable/writable by owner)
* `workspaces/{workspaceId}` — Multi-shop workspaces
* `workspaces/{workspaceId}/products/{productId}` — Product inventory
* `workspaces/{workspaceId}/listings/{listingId}` — Etsy listing studio drafts
* `workspaces/{workspaceId}/keywords/{keywordId}` — SEO keyword repository
* `workspaces/{workspaceId}/productIdeas/{ideaId}` — Brainstormed product ideas
* `workspaces/{workspaceId}/aiGenerations/{generationId}` — Generation audit log
* `workspaces/{workspaceId}/usage/{usageId}` — Server-enforced quota tracking
* `workspaces/{workspaceId}/auditLogs/{logId}` — Append-only audit logs

---

## 6. Local Development with Firebase Emulator Suite

To run the full Firebase backend locally:

```bash
# Install Firebase CLI if needed
npm install -g firebase-tools

# Start the Emulator Suite (Auth, Firestore, Storage)
firebase emulators:start
```

Emulators will be accessible at:
* Emulator UI: `http://localhost:4000`
* Authentication: `http://localhost:9099`
* Firestore: `http://localhost:8080`
* Storage: `http://localhost:9199`
