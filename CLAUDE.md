# Improv Y Corazón — Corazón Presence Method Tracker

## Project Overview
A mobile-first progress tracking web app for Corazón Presence Method workshops. Participants self-rate before and after each session; they see their own progress chart. The facilitator (admin) sees a dashboard with all participants' data.

## Tech Stack
- **Frontend:** React (Vite)
- **Backend/DB:** Firebase (Firestore + Auth)
- **Hosting:** Firebase Hosting
- **Styling:** CSS Modules or Tailwind — clean, minimal, green branding

## Core Features

### Participant View
- Login (Firebase Auth — email/password or magic link)
- Pre/post session rating form: rate 1–5 on the 5 Core Mentor Capacities:
  - Recovery Speed After Stress
  - Ability To Take Healthy Social Risks
  - Listening Without Fixing
  - Ability To Prioritize Under Pressure
  - Recovery After Falling Behind
- Only the currently active session is shown for rating
- Personal progress chart (line or bar chart showing before/after over time)
- Read-only access to own data only

### Admin View
- Login with admin role
- Dashboard showing all participants' data
- Per-participant breakdown and aggregate trends
- Session management: set which of the 6 fixed sessions is currently active

### Sessions (fixed, defined in src/sessions.js)
- Week 1: The First Yes
- Week 2: Pressure & Presence
- Week 3: The Corazón Shift
- Week 4: Noticing
- Week 5: Settling
- Week 6: Little Bird Moment

## Design Guidelines
- Mobile-first, responsive
- Clean and minimal UI
- Green branding (primary color palette built around green)
- No clutter — participants should be able to rate themselves in under 60 seconds

## Data Model (Firestore)
- `users/{uid}` — profile + role (`participant` | `admin`)
- `sessions/{sessionId}` — session metadata (date, title)
- `ratings/{ratingId}` — `{ userId, sessionId, timing: "pre"|"post", recoverySpeedAfterStress, healthySocialRisks, listeningWithoutFixing, prioritizeUnderPressure, recoveryAfterFallingBehind, createdAt }`
- `config/settings` — `{ activeSessionId }` — admin-controlled, readable by all authenticated users

## Key Constraints
- Participants can only see their own data
- Firestore security rules must enforce data isolation
- Admin role checked server-side via Firestore rules and/or Firebase custom claims

## Commands
```bash
npm run dev       # local dev server
npm run build     # production build
npm run deploy    # firebase deploy
```
