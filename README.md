# NEXUS-LEARN

NEXUS-LEARN is a cloud-native, adaptive learning platform built to improve student outcomes while reducing institutional overhead. It combines real-time learner profiling, AI-assisted personalization, and an administrative command center in a single React + Firebase application.

## LIVE WEBSITE URL : https://project-nexus-learn.vercel.app/

## Executive Overview

### The Problem
Education technology is split between:

- Expensive enterprise LMS platforms with heavy infrastructure and licensing overhead (often quoted on a per-student basis).
- Generic one-size-fits-all systems that do not adapt to individual learning behavior.

The result is predictable: educators can spend as much as 40% of their time on administrative work, while students are left with static learning experiences that ignore pace, context, and cognitive state.

### The NEXUS-LEARN Solution
NEXUS-LEARN addresses three core challenges:

1. Cost efficiency with serverless architecture:
Firebase Auth + Firestore remove traditional backend infrastructure burden and support usage-based scaling, with a target of up to 80% lower platform cost compared with traditional enterprise LMS setups.
2. Personalization at scale:
A React dashboard continuously adapts learner-facing insights and recommendations based on profile and behavior signals.
3. Administrative intelligence:
An institutional panel aggregates learner risk and fatigue signals to support faster intervention and better academic oversight.

### Technical Innovation
Instead of relying on heavyweight training pipelines, NEXUS-LEARN uses an intelligent, practical architecture:

- Deterministic local modeling (`computeTwin`) for immediate baseline insights.
- Optional Gemini augmentation for deeper narrative reasoning and personalization.
- Firestore-backed document data model for fast, index-friendly profile and cohort queries.

This keeps the platform fast, extensible, and deployable now.

## Core Product Modules

### SENTINEL
Cognitive load and fatigue intelligence engine.

- Fatigue scoring (`0-100`) from wellbeing and workload signals.
- 72-hour cognitive forecast bands (green/amber/red).
- Intervention cueing (schedule nudge, rest recommendation, advisor alert, pastoral flag).

### IRIS
Adaptive reading and comprehension engine.

- Dynamic typography and reading-surface adaptation.
- Text complexity analysis and reading profile adjustments.
- Optional Gemini Q&A for student-entered notes/questions.

### APOLLO
Academic risk and institutional visibility engine.

- Dropout risk tiering (low/moderate/high/critical).
- Factor-level risk contributors.
- Cohort-level summaries for advisor/admin review.

## 📸 Screenshots

<p align="center">
<table>
  <tr>
    <td align="center">
      <img src="img/home.png" width="420" alt="Home 1" style="border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.15); margin:8px;" />
    </td>
    <td align="center">
      <img src="img/home2.png" width="420" alt="Home 2" style="border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.15); margin:8px;" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="img/home3.png" width="420" alt="Home 3" style="border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.15); margin:8px;" />
    </td>
    <td align="center">
      <img src="img/home4.png" width="420" alt="Home 4" style="border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.15); margin:8px;" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="img/login.png" width="420" alt="Login" style="border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.15); margin:8px;" />
    </td>
    <td align="center">
      <img src="img/signup.png" width="420" alt="Sign Up 1" style="border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.15); margin:8px;" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="img/signup2.png" width="420" alt="Sign Up 2" style="border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.15); margin:8px;" />
    </td>
    <td align="center">
      <img src="img/signup3.png" width="420" alt="Sign Up 3" style="border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.15); margin:8px;" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="img/signup4.png" width="420" alt="Sign Up 4" style="border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.15); margin:8px;" />
    </td>
    <td align="center">
      <img src="img/user.png" width="420" alt="Dashboard 1" style="border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.15); margin:8px;" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="img/user2.png" width="420" alt="Dashboard 2" style="border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.15); margin:8px;" />
    </td>
    <td align="center">
      <img src="img/user3.png" width="420" alt="Dashboard 3" style="border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.15); margin:8px;" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="img/user4.png" width="420" alt="Dashboard 4" style="border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.15); margin:8px;" />
    </td>
    <td align="center">
      <img src="img/user5.png" width="420" alt="Dashboard 5" style="border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.15); margin:8px;" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="img/user6.png" width="420" alt="Dashboard 6" style="border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.15); margin:8px;" />
    </td>
    <td align="center">
      <img src="img/user7.png" width="420" alt="Dashboard 7" style="border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.15); margin:8px;" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="img/user8.png" width="420" alt="Dashboard 8" style="border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.15); margin:8px;" />
    </td>
    <td align="center">
      <img src="img/admin.png" width="420" alt="Admin 1" style="border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.15); margin:8px;" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="img/admin2.png" width="420" alt="Admin 2" style="border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.15); margin:8px;" />
    </td>
    <td align="center">
      <img src="img/admin3.png" width="420" alt="Admin 3" style="border-radius:14px; box-shadow:0 4px 14px rgba(0,0,0,0.15); margin:8px;" />
    </td>
  </tr>
</table>
</p>


## What Is Implemented Today

- Branded landing and onboarding experience.
- 4-step student profile capture (identity, wellbeing, learning, academics).
- Firebase Authentication (email/password).
- Firestore-backed user persistence.
- Student dashboard with tabs: `Overview`, `Sentinel`, `Iris`, `Apollo`.
- AI-augmented digital twin and recommendations (when Gemini key is configured).
- Deterministic fallback mode when Gemini is unavailable.
- Institutional cohort console with peer visibility and intervention indicators.
- Admin panel with:
  - platform metrics,
  - student search/listing,
  - profile edit/delete flows,
  - recent activity view.

## Tech Stack

- Frontend: React 19, React DOM, Create React App (`react-scripts`)
- Data/Auth: Firebase Auth + Cloud Firestore
- AI: Gemini 2.5 Flash API (optional but supported)
- Testing: React Testing Library + Jest DOM
- Styling: In-component design system + injected global CSS tokens

## Architecture (High Level)

```text
Student Input/Profile
        |
        v
Deterministic Twin Engine (SENTINEL + IRIS + APOLLO baseline)
        |
        +--> Optional Gemini Enrichment (analysis, recs, Q&A)
        |
        v
Adaptive UI (student + institutional + admin views)
        |
        v
Firebase (Auth + Firestore user documents + session state)
```

## Repository Structure

```text
nexus-learn/
|-- docs/
|   `-- images/
|-- public/
|   `-- index.html
|-- src/
|   |-- NexusLearnDashboard.jsx
|   |-- firebase.js
|   `-- index.js
|-- .env
|-- .gitignore
|-- package.json
`-- package-lock.json
```

## Data Model (Firestore)

User documents are stored in the `users` collection (document key: lowercased email).

```json
{
  "uid": "u_...",
  "email": "student@example.com",
  "fullName": "Student Name",
  "cohort": "B.Tech Computer Science & Engineering",
  "studentId": "AUTOID",
  "institution": "University Name",
  "yearOfStudy": "2",
  "profile": {
    "sleepHours": "7",
    "stressLevel": "5",
    "studyHoursPerDay": "4",
    "exercisePerWeek": "3",
    "screenTimeHours": "6",
    "caffeine": "2",
    "lastRestDays": "1",
    "hydration": "moderate",
    "breakFrequency": "2",
    "mentalHealthRating": "6",
    "socialEngagement": "3",
    "deadlineAnxiety": "moderate",
    "workingStatus": "student",
    "readingSpeed": "250",
    "motivationLevel": "7",
    "courseDifficulty": "3",
    "missedDeadlines": "0",
    "attendanceRate": "85",
    "gpaLast": "3.0"
  },
  "createdAt": "ISO_DATE",
  "lastUpdated": "ISO_DATE",
  "loginHistory": ["ISO_DATE"]
}
```

## Local Setup

### Prerequisites

- Node.js 18+ (recommended)
- npm 9+ (recommended)
- Firebase project (Auth + Firestore enabled)
- Gemini API key (optional but recommended)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```bash
REACT_APP_GEMINI_API_KEY=your_gemini_key

REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Run in development

```bash
npm start
```

Runs at `http://localhost:3000`.

### 4. Build for production

```bash
npm run build
```

## Available Scripts

- `npm start`: Run local dev server
- `npm run build`: Create production build
- `npm test`: Run tests
- `npm run eject`: Eject CRA config

## Security Notes (Important)

- Move admin credentials out of source code and into secure auth/role management before production.
- Rotate any exposed API keys immediately if they were committed.
- `.env` is gitignored — never commit it. Use `.env.example` as a reference template.
- Enforce Firebase Security Rules for least-privilege access.

## Deployment

NEXUS-LEARN can be deployed as a static React bundle with managed backend services:

- Frontend hosting: Firebase Hosting, Vercel, Netlify, or any static host.
- Backend services: Firebase Auth + Firestore.
- AI layer: Gemini API via `REACT_APP_GEMINI_API_KEY`.

## Roadmap

- Split monolithic dashboard into domain modules/components.
- Replace hardcoded admin shortcut with role-based Firebase authorization.
- Add audit logging and stronger operational analytics.
- Extend adaptive content modules (quiz workflows, media-based learning flows).

## License

This project is licensed under the [MIT License](LICENSE). Copyright (c) 2026 Rohit Jain.

## Author

Rohit Jain  
LinkedIn: https://www.linkedin.com/in/546-rohit-jain

Debdatta Panda
LinkedIn: https://www.linkedin.com/in/myself-debdatta-194a822b1

Soumyasri Mohapatra
LinkedIn: https://www.linkedin.com/in/soumyasri-mohapatra-99211625b

Ritisha Sahoo
LinkedIn: https://www.linkedin.com/in/ritisha-sahoo-67a046364

Sahil Kumar sahoo
LinkedIn: https://www.linkedin.com/in/sahil-kumar-sahoo-4055b7368