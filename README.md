# NoCron 
**Webhook-triggered workflow automation, with nothing to manage.**

Built a full-stack automation platform where users chain a trigger with Email, Slack, and Discord actions and 
publish to get a unique webhook URL that runs the workflow on every hit, with no infrastructure to manage.

**Live:** https://no-cron.vercel.app

---

## Features

- **Linear workflow builder**: one trigger followed by an ordered list of actions (Email, Slack, Discord)
- **One-click publish**: get a unique webhook URL for each workflow
- **Reliable async execution**: webhook requests return quickly and run in the background via a queue
- **No lost or duplicate runs**: transactional outbox plus idempotent jobs
- **Automatic retries**: 3 attempts with exponential backoff
- **Google sign-in only**: OAuth 2.0 with session-based auth
- **Dashboard**: view and manage all your workflows
- **Backend Validation**: Zod schemas on the server-side

---

## Architecture
<img width="1727" height="707" alt="image" src="https://github.com/user-attachments/assets/7940d1ac-e19e-485c-8820-ed889794cd8a" />

### Why the outbox pattern?

Writing to Postgres and pushing to BullMQ queue are two separate systems, so a crash between them could lose a triggered workflow (the dual-write problem). The outbox makes the database write atomic and lets the sweeper recover anything that didn't reach the queue.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, TypeScript, Tailwind |
| Backend | Node.js, Express, TypeScript, Zod |
| Database | PostgreSQL, Prisma |
| Queue | Redis, BullMQ |
| Auth | Passport.js (Google OAuth 2.0), express-session |

---

## Project Structure

```
NoCron/
├── backend/    # Express API, sweeper, BullMQ worker, Prisma schema
└── frontend/   # React dashboard
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis
- A Google OAuth client

### 1. Clone

```bash
git clone https://github.com/codewkaushik404/NoCron.git
cd NoCron
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in the values below
npx prisma migrate dev
npm run build          # to compile ts -> js
npm run start          # start API server
npm run dev            # start API server in dev mode

npm run start:sweeper  # start sweeper
npm run dev:sweeper    # start sweeper in dev mode

npm run start:worker   # start bullmq worker
npm run dev:worker     # start bullmq worker in dev mode
```


### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```
