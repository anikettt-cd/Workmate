# 🤝 WorkMate

[![Next.js 14](https://shields.io)](https://nextjs.org)
[![TypeScript](https://shields.io)](https://typescriptlang.org)
[![Prisma](https://shields.io)](https://prisma.io)
[![Socket.io](https://shields.io)](https://socket.io)
[![License: MIT](https://shields.io)](https://opensource.org)

> **Connecting talented job seekers with quality work opportunities through AI-powered matching and real-time communication.**

WorkMate is a complete, fully operational local hiring platform packed with AI-generated visuals, real-time chat infrastructure, and an intelligent job-matching engine. 

---

## ⚡ Core Features

### 🔐 Authentication & User Management
* **JWT-Based Security** – Robust authentication utilizing secure `bcrypt` password hashing.
* **Role-Based Routing** – Distinct system perspectives and dashboard control limits tailored for **Contractors** and **Job Seekers**.
* **Instant Visual Identities** – Dynamic AI-generated avatars built natively during signup workflows.

### 💼 Contractor Dashboard
* **Smart Job Posting** – Create rich job ads detailing required skills, wages, location metrics, and duration requirements.
* **Contextual Graphics** – Automated visual generation mapping job requirements directly to tailored cover illustrations.
* **Applicant Pipelines** – View, evaluate, accept, or reject incoming job seeker applications seamlessly in real time.

### 🧑‍💻 Job Seeker Dashboard
* **Dynamic Profiles** – Build professional showcases featuring skill taxonomy, experiences, language selections, and locations.
* **Geo-Proximate Browsing** – Scan, search, and map jobs located near the user's geographic target.
* **Application Tracker** – One-click workflows to apply, monitor status shifts, and review continuous work histories.

### 🤖 AI-Powered Intelligence
* **Algorithmic Matchmaking** – Evaluates combinations of skill similarity, spatial distance, and candidate experience scores.
* **Reasoned Decisions** – Explains matching outcomes transparently using clear, metric-driven rationale break-downs.

### 💬 Real-Time Communications & i18n
* **Socket.io Core** – Low-latency instant message routing alongside systemic push notifications.
* **Deep Internationalization** – Native localized translation architecture targeting **English (`/en`)**, **Hindi (`/hi`)**, and **Marathi (`/mr`)** using `next-intl`.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI/UX** | Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui, Lucide Icons |
| **Backend Core** | Node.js API Routes, Next.js Middleware |
| **Real-Time Data** | Socket.io |
| **Database & ORM**| SQLite, Prisma ORM |
| **Authentication** | JSON Web Tokens (JWT) + `bcrypt` |
| **Localization**   | `next-intl` |
| **AI Graphics**    | DiceBear API placeholders *(swappable with production text-to-image engines)* |

---

## 🚀 Getting Started

### 📋 Prerequisites
* **Node.js** 18+ installed
* **npm** or **yarn** configured
* **Git** installed

### 1. Clone & Core Setup
Clone the repository, enter the workspace, and pull core dependencies:
```bash
git clone https://github.com # Replace with actual url if needed
cd workmate
npm install
```

### 2. Database Initialization
Generate your typing blueprints and map schemas onto the local SQLite layer:
```bash
npm run db:generate
npm run db:push
```

### 3. Environment Settings
Create a `.env.local` configuration file directly inside your root workspace folder:
```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
DATABASE_URL="file:./dev.db"
```

### 4. Launch Local Development
Fire up the hybrid server orchestrating the Next.js routes along with active Socket.io communication loops:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** inside your browser to access the app.

---

## 🗄️ Database Operations

Management workflows utilize SQLite running inside a Prisma context. To open a clean, UI-driven data viewer for management, execute:
```bash
npm run db:studio
```

If you alter `prisma/schema.prisma` during feature additions, execute a refresh pass using:
```bash
npm run db:generate
npm run db:push
```

---

## 🤖 Deep Dive: AI Scoring Algorithm

Matches are synthesized through weighted vector assessments prioritizing high-impact attributes:

* **Skill Synthesis (40–50%)** – Strict semantic overlap computation comparing job prerequisites against seeker skillsets.
* **Experience Modifier (20–30%)** – Tiered bonus multipliers calculated using professional background lifespans.
* **Location Proximity (20–30%)** – Prioritization indices shifting local, nearby opportunities up the recommendations ranks.
* **Reputation Integrity (10%)** – Modulates matching matrices based on historical contractor interaction rankings.

---

## 📱 Core API Endpoints

### 🔐 Authentication
* `POST /api/auth/signup` – Register new user accounts.
* `POST /api/auth/login` – Validate credentials and hand off authorization JWT vectors.

### 💼 Jobs Engine
* `GET /api/jobs` – Fetch indexed opportunities against specific parameter filters.
* `POST /api/jobs` – Publish a new role listing *(Contractor Auth Required)*.

### 📑 Applications
* `GET /api/applications` – Pull historical and pending interaction histories.
* `POST /api/applications` – File a candidacy placement against open roles *(Job Seeker Auth Required)*.
* `PATCH /api/applications` – Advance or reject ongoing applications *(Contractor Auth Required)*.

### 🧠 Recommendations
* `GET /api/ai/recommendations` – Read optimized matchmaking feeds.
* `POST /api/ai/recommendations` – Refresh intelligence matrices and generate new scoring items.

---

## 🔧 Project Blueprint

```text
workmate/
├── src/
│   ├── app/
│   │   ├── [locale]/             # i18n Route handling
│   │   │   ├── dashboard/       # Specialized role interfaces
│   │   │   └── page.tsx         # Gateway landing
│   │   └── api/                 # Endpoints (auth, jobs, applications, ai)
│   └── i18n.ts                  # Localization setup
├── lib/                         # Singleton connections & utility logic
│   ├── prisma.ts
│   ├── auth.ts
│   ├── ai-recommendations.ts
│   └── ai-images.ts
├── messages/                    # Multi-language JSON structural dictionaries
│   ├── en.json
│   ├── hi.json
│   └── mr.json
├── prisma/                      # Database structure blueprints
│   └── schema.prisma
├── server.js                    # Core socket infrastructure runner
└── package.json
```

---

## 🚀 Production Deployment

Compile optimized standalone static bundles and activate the target production server:
```bash
npm run build
npm start
```

Ensure the following environmental variables are loaded into your live production environment pipeline:
```env
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret
DATABASE_URL=your-production-database-url
PORT=3000
```

---

## 🔮 Future Enhancements
- [ ] **Native Generative AI** – Bridge placeholder loops into live midjourney/DALL-E pipelines.
- [ ] **Business Intel Dashboards** – Rich graphical breakdown dashboards logging microeconomic marketplace data trends.
- [ ] **Integrated Payment Pipes** – Secure, milestone-based Escrow payment distribution setups using Stripe.
- [ ] **Native Mobile Port** – Expand reach using React Native interfaces mapping to these core API routes.

---

## 🤝 Contributing

1. **Fork** the Repository.
2. **Branch out** your additions (`git checkout -b feature/AmazingFeature`).
3. **Commit** changes securely (`git commit -m 'Add some AmazingFeature'`).
4. **Push** features upward (`git push origin feature/AmazingFeature`).
5. **Open** a clean Pull Request targeting main lines.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
