# SwiftRide Web Admin Console

This repository contains the **SwiftRide web administrator console** and its Express/WebSocket backend. The passenger and driver mobile applications are maintained in the separate `new_app` and `driver_app` repositories and connect to this backend through the configured API and mobile key.

## Included in this repository

The retained source is limited to the administrator dashboard, shared admin state and data models, the Leaflet operations map, branding assets, and the central backend. The backend provides authentication, role-protected administration routes, audit logging, rate limiting, emergency handling, driver onboarding, support tickets, platform settings, and WebSocket updates.

## Local setup

1. Install Node.js 20 or newer.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create the environment file:

   ```bash
   cp .env.example .env
   ```

   On Windows Command Prompt, use `copy .env.example .env`.

4. Generate an admin password hash. Replace `choose-a-password` with the password you want to use:

   ```bash
   node -e "const c=require('node:crypto');const s=c.randomBytes(16).toString('hex');console.log(s+':'+c.scryptSync(process.argv[1],s,64).toString('hex'))" 'choose-a-password'
   ```

5. Put the generated value in `.env` as `SWIFTRIDE_ADMIN_PASSWORD_HASH`. Configure a long random `SWIFTRIDE_TOKEN_SECRET`, a separate `SWIFTRIDE_MOBILE_KEY`, and the admin username.
6. Start the backend:

   ```bash
   npm run server
   ```

7. In a second terminal, start the administrator web app:

   ```bash
   npm run dev
   ```

8. Open `http://localhost:3000` and log in with the configured admin credentials. The backend health endpoint is available at `http://localhost:5000/api/health`.

## Verification

Run the frontend type check and backend security verification with:

```bash
npm run lint
node --check server.js
node scripts/verify-backend.mjs
npm run build
```

Production deployments must use HTTPS, a durable database, secret management, and a restricted CORS origin. Never commit `.env` files or real credentials.
