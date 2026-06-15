# 🛡️ NirnayAI

> The Ultimate AI-Powered Mobile Security Analysis & Reverse Engineering Platform

NirnayAI is an advanced, automated malware analysis platform designed to inspect Android applications (APKs) and definitively assess their threat level. Powered by a high-performance Llama-3 AI agent and the robust MobSF engine, NirnayAI breaks down complex static and dynamic analysis data into actionable, executive-grade intelligence.

## ✨ Features

- 🕵️ **Deep Static Analysis:** Automatically decompiles APKs, mapping permissions, trackers, and manifest vulnerabilities.
- 🤖 **AI Threat Intelligence:** Utilizes Groq's blazing-fast Llama-3-70B model to interpret raw technical data and generate human-readable security reports.
- 🎯 **Definitive Installation Verdicts:** Instantly tells users whether an app is "Safe to Install", "Proceed with Caution", or "DO NOT INSTALL" based on deterministic scoring and AI analysis.
- 💬 **WhatsApp Bot Integration:** Submit APKs directly via WhatsApp and receive a fully formatted security report right in your chat.
- ⚡ **Real-time Pipeline:** Beautiful, responsive React dashboard that tracks analysis progress in real-time via Redis and BullMQ.

## 🏗️ Architecture

- **Frontend:** React + Vite, styled with Tailwind CSS for a premium, glassmorphic UI.
- **Backend:** Node.js, Express, BullMQ (for job queues), Prisma (PostgreSQL).
- **Core Engine:** Mobile Security Framework (MobSF) running securely in a Dockerized environment.
- **AI Brain:** Groq LLM API.
- **Infrastructure:** Fully containerized with Docker Compose, orchestrated by GitHub Actions CI/CD.

## 🚀 Deployment

NirnayAI is designed to be easily deployed to an Azure Linux VM using Docker Compose.

1. Clone the repository.
2. Ensure you have your `.env` configured with your Postgres, Redis, Groq, and WhatsApp API keys.
3. Run `docker compose up -d --build` to spin up the entire ecosystem (Web, API, Worker, Bot, Postgres, Redis, and MobSF).

## 🔒 Security

NirnayAI analyzes apps in an isolated environment to prevent malware escape. Always ensure your instance is deployed securely behind a reverse proxy (e.g., Nginx) or Cloudflare with strict firewall rules.
