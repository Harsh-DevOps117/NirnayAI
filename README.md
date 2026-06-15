<div align="center">
  <img src="./apps/web/public/favicon.svg" alt="NirnayAI Logo" width="120" />
  <h1>NirnayAI</h1>
  <p><strong>Advanced AI-Powered Mobile Security & Automated Malware Analysis Platform</strong></p>
</div>

<br />

NirnayAI is an enterprise-grade mobile application security platform designed to automatically dissect, analyze, and grade Android applications (APKs) for malicious behavior. By integrating the industry-leading **Mobile Security Framework (MobSF)** engine with **Groq's high-speed Llama-3 AI**, NirnayAI eliminates the need for manual reverse engineering by translating complex static and dynamic forensic data into actionable, executive-ready security reports.

## 🚀 Key Features

* **Zero-Touch Analysis:** Users upload an APK (via the React Dashboard or WhatsApp Bot) and NirnayAI automatically handles decompilation, manifest extraction, and threat mapping.
* **Deterministic Risk Scoring:** Generates definitive verdicts (`Safe to Install`, `Proceed with Caution`, `DO NOT INSTALL`) based on objective threshold criteria.
* **AI-Generated Threat Intelligence:** Llama-3 70B synthesizes raw permission arrays, tracker URLs, and exposed API hooks into a human-readable executive summary with actionable mitigations.
* **Real-Time Job Tracking:** An asynchronous architecture utilizing Redis and BullMQ provides real-time pipeline status directly to the user interface.
* **Omnichannel Access:** Supports both a premium Web Application interface and an interactive WhatsApp Bot for scanning on-the-go.

---

## 🛠️ Technology Stack

NirnayAI operates on a robust, highly decoupled monorepo architecture:

### Frontend
* **Framework:** React 18 & Vite
* **Styling:** Tailwind CSS + Framer Motion (for smooth micro-interactions)
* **Components:** Custom glassmorphic UI elements and Lucide icons

### Backend Services
* **API Server:** Node.js, Express.js, TypeScript
* **Task Queues:** BullMQ & Redis (handles long-running file parsing safely)
* **Database:** PostgreSQL managed via Prisma ORM
* **AI Processing:** Groq SDK (Llama-3.3-70b-versatile)

### Core Analysis Engine
* **MobSF:** Mobile Security Framework runs as an isolated container to safely detonate and analyze untrusted binaries via its REST API.

---

## ⚙️ How It Works (The Pipeline)

1. **Ingestion:** An APK is uploaded via the Next.js frontend or WhatsApp API.
2. **Queueing:** The API server delegates the heavy lifting to the Redis queue, preventing HTTP timeouts.
3. **Forensic Analysis:** The Node.js Worker picks up the job and streams the APK to the isolated `mobsf` Docker container. MobSF decompiles the app, analyzes the `AndroidManifest.xml`, maps domains, and flags tracking SDKs.
4. **AI Synthesis:** The raw, highly-technical JSON report from MobSF is stripped of bloat and fed into Groq's Llama-3 LLM. The AI is specifically prompted as a Cyber Fraud Investigator to deduce the app's true intent (e.g., correlating `RECEIVE_SMS` with `INTERNET` as a potential banking Trojan).
5. **Report Generation:** The deterministic risk score and AI mitigations are saved to PostgreSQL via Prisma.
6. **Real-time Delivery:** The React frontend (polling or socket) receives the completed Executive Report and updates the UI instantly.

---

## 🚢 CI/CD & Deployment

NirnayAI is designed for fully automated, zero-downtime deployments on an **Azure Linux VM (4-Core, 16GB RAM)**.

* **Containerization:** The entire architecture (Web, API, Worker, WhatsApp Bot, Postgres, Redis, and MobSF) is orchestrated using `docker-compose.yml`.
* **CI/CD Pipeline:** Powered by **GitHub Actions** (`.github/workflows/cd.yml`).
  1. On every push to `master`, GitHub Actions builds Docker images for every internal service.
  2. Images are pushed to the **GitHub Container Registry (GHCR)**.
  3. The action securely SSHs into the Azure VM (`appleboy/ssh-action`).
  4. The VM pulls the latest images from GHCR and gracefully restarts the containers via `docker compose up -d`, automatically applying any Prisma database migrations.

### Environment Requirements
To run this project, the host machine requires the following environment variables:
* `DATABASE_URL` (Postgres)
* `REDIS_URL` (Redis)
* `GROQ_API_KEY` (AI Processing)
* `MOBSF_API_KEY` (Hardcoded auth for the MobSF engine)
* WhatsApp / Meta Graph API Tokens (for the bot service)

## 🔒 Security & Privacy

NirnayAI processes potentially lethal malware. For deployment security:
* The MobSF engine does not expose its ports publicly; it is only accessible internally within the Docker network by the Worker.
* Web traffic should be routed through a reverse proxy (Nginx or Cloudflare) to ensure HTTPS (TLS 1.2+) compliance and prevent mixed-content blocking.
