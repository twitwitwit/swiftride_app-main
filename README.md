# SwiftRide Central Platform

This repository contains the shared SwiftRide web operations console and its Express/WebSocket backend. The passenger app in `new_app` and the driver app in `driver_app` connect to this same backend.

## Local integration

1. Copy `.env.example` to `.env`.
2. Set a long random `SWIFTRIDE_TOKEN_SECRET` and a separate `SWIFTRIDE_MOBILE_KEY`.
3. Generate an admin password hash:

```bash
node -e "const c=require('node:crypto');const s=c.randomBytes(16).toString('hex');console.log(s+':'+c.scryptSync(process.argv[1],s,64).toString('hex'))" 'choose-a-password'
```

4. Put the generated value in `SWIFTRIDE_ADMIN_PASSWORD_HASH`.
5. Start the backend with `npm run server`.
6. Start the web console with `npm run dev` and log in using `SWIFTRIDE_ADMIN_USERNAME` and the password used in step 3.
7. Build each Android app with the same backend URL and mobile key:

```bash
./gradlew :app:assembleDebug \
  -PSWIFTRIDE_API_BASE_URL=http://10.0.2.2:5000/api \
  -PSWIFTRIDE_MOBILE_KEY=the-value-from-.env
```

For a physical device, replace `10.0.2.2` with the reachable HTTPS API host. Production builds must use HTTPS and a secret-management system; never commit `.env` files or real credentials.

## Shared behavior

Passenger ride requests, driver ride status updates, driver applications, tickets, notifications, settings, and SOS events are persisted by the central server and broadcast to connected web clients over WebSocket. The server enforces bearer-token authentication for the web admin and a separately configurable mobile client key for the Android clients. Administrative operations require the administrator role.

The server currently uses an in-memory store for the prototype. Before production deployment, replace it with a durable database and add user-level authentication, audit logging, rate limiting, and encrypted secrets storage.
