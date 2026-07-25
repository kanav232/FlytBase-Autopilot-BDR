# 🤖 Autonomous Inbound BDR Agent

An automated, multi-agent AI system built for enterprise Business Development Representative (BDR) workflows. It accepts inbound lead emails via webhook and autonomously performs MEDDPICC qualification, deep web account research, and dynamic response sequence generation.

This project is built using **TypeScript**, the **Groq API** (for lightning-fast LLaMA 3 reasoning), and is optimized for deployment as a serverless function on **Vercel**.

## 🚀 Features

1. **Lead Qualification (MEDDPICC):** Extracts and maps the email context to the MEDDPICC framework using strictly validated JSON outputs.
2. **Deep Account Research:** Pulls in external data to contextually understand the prospect's company and operational environment.
3. **Sequence Generation:** Autonomously writes a progressive, personalized 3-step outbound email sequence designed to uncover missing MEDDPICC variables.
4. **Case Study Matching:** Contextually aligns historical case studies (e.g., Anglo American) to the prospect's specific pain points.
5. **GTM Motion Logic:** Applies a deterministic decision tree to route the prospect to the appropriate Go-To-Market motion (Direct AE vs. Partner).
6. **AE Handoff Summary:** Compiles all intelligence into a clean, actionable Markdown document for Account Executives.

## 🛠 Tech Stack

- **Runtime:** Node.js / TypeScript
- **Framework:** Vercel Serverless (`@vercel/node`)
- **LLM Engine:** [Groq](https://groq.com/) API (llama-3.3-70b-versatile)
- **Validation:** Zod (for strict JSON schema enforcement)

## 💻 Local Development

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   Rename `.env.example` to `.env` and add your Groq API key:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Run the local test script:**
   Simulate an incoming webhook locally to see the agent process a sample inbound lead.
   ```bash
   npx tsx scripts/test-webhook.ts
   ```

## 🌐 Deployment (Vercel)

This project is configured out-of-the-box for Vercel. 

1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy to Production:
   ```bash
   vercel --prod
   ```

3. Add your `GROQ_API_KEY` to your Vercel project environment variables in the Vercel dashboard (or via CLI):
   ```bash
   vercel env add GROQ_API_KEY
   ```
   *Remember to redeploy after adding environment variables.*

## 📡 Webhook Usage

Once deployed, you can trigger the agent by sending a `POST` request to your Vercel URL at the `/api/webhook` endpoint with the raw email string in the body.

**Example cURL:**
```bash
curl -X POST https://your-vercel-project.vercel.app/api/webhook \
-H "Content-Type: text/plain" \
-d "From: Rodrigo Castillo (r.castillo@sqm.cl)
Title: Head of Operations, Northern Operations Division
Company: SQM
Subject: Autonomous inspection
Context: Looking for drone-based inspection for 3 large-scale sites."
```

## 📄 License
MIT License
