# 🏛️ The Morrigan: Elite Financial Intelligence Platform

![Next.js 15](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python 3.10+](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white)
![Pinecone](https://img.shields.io/badge/Pinecone-000000?style=for-the-badge&logo=pinecone&logoColor=white)

**The Morrigan** is a state-of-the-art editorial and news platform designed for the Indian financial market. Built with a "Security-First" philosophy, it offers in-depth case studies, market analysis, and startup growth journeys, powered by a sophisticated Retrieval-Augmented Generation (RAG) AI engine.

---

## 🚀 The Vision & Workflow

**Morrigan** isn't just a blog; it's a "Hardened Intelligence Repository."
1. **Dynamic Content Hub:** Admins manage a real-time feed of market intel with a "Zen-Mode" editor.
2. **State-Gate System:** Blogs are dynamically tagged (`Published`, `Draft`, `Archived`). The public frontend live-syncs with the backend to display only verified intelligence.
3. **The Mind of Morrigan (RAG AI):** We've implemented a custom RAG (Retrieval-Augmented Generation) pipeline. Using **Pinecone Vector Database** and **Gemini 2.5 Flash**, our chatbot doesn't just "talk"—it "analyzes." It reads the article you are viewing to provide pinpoint accurate financial insights.

---

## 🛡️ Engineering Excellence (Hardened & Optimized)

We recently completed a **Security & SEO Sprint** to ensure Morrigan is production-ready:
*   **Security:**
    *   **XSS Shield:** Armed with `DOMPurify` to block malicious script injections.
    *   **Auth Vault:** Strictly hashed passwords (PBKDF2) and JWT-protected admin routes (No plain-text fallbacks).
    *   **CORS & DoS:** Whitelisted origin policies and strict payload length validation.
*   **SEO Mastery:**
    *   **Rich Snippets:** Dynamic JSON-LD (BlogPosting) injection for Google Rich Results.
    *   **Automated Sitemap:** Dynamic `sitemap.xml` and `robots.ts` generation via Next.js 15 Metadata API.

---

## 🛠️ Tech Stack & Architecture

### **Frontend (Next.js 15)**
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + Vanilla CSS (Premium Custom Aesthetics)
*   **Animations:** Framer Motion (Micro-interactions) + Lenis (Smooth Scroll)
*   **State:** React Metadata API (SEO) + Custom Event-driven Logic

### **Backend (FastAPI)**
*   **Engine:** Python 3.10+ / FastAPI
*   **Database:** SQLAlchemy (ORM) + SQLite/PostgreSQL
*   **Auth:** JWT (Jose) + Passlib (PBKDF2 Hashing)
*   **AI Stack:** Google Gemini 2.5 Flash + Pinecone (Vector Search)

---

## 📁 Repository Structure

```asl
├── frontend/               # Next.js 15 Application
│   ├── src/app/            # App Router (Pages, Layouts, API Routes)
│   ├── src/components/     # UI Component Library (RichTextEditor, 3D Layers)
│   └── src/lib/            # API Clients & Utilities
├── backend/                # FastAPI Application
│   ├── api/                # Endpoints (Blogs, Chat, Auth, Contact, Upload)
│   ├── database/           # Models & Schemas (SQLAlchemy)
│   ├── services/           # Business Logic (AI Service, RAG, Image Management)
│   └── uploads/            # Secure local image storage
└── README.md               # You are here
```

---

## 👥 The Morrigan Team

This platform is a collaborative effort between dedicated intelligence and engineering teams:

### **🏗️ Frontend (Client Intelligence)**
*   **[Pushkar Gangurde](https://github.com/pushkar156)** — Team Head & Full-Stack Architect
*   **[Aarush Verma](https://github.com/Hunt2806)**
*   **[Tanay Chaudhari](https://github.com/Tan-code1310)**
*   **[Sharvani Walawalkar](https://github.com/vani-walkar)**

### **🧠 Chatbot & Knowledge Extraction (RAG)**
*   **[Ruchi Chandak](https://github.com/chandakruchi85-beep)** — Team Head
*   **[Hrushikesh Kapre](https://github.com/Hrushi027-mitwpu)**
*   **[Himanshu Raghav](https://github.com/Himanshu-Raghav1)**
*   **[Rashi Malpani](https://github.com/rashimalpani)**

### **🧱 Backend & Security Architecture**
*   **[Pushkar](https://github.com/pushkar156)** — Lead Backend Engineer & Security Strategist

---

## ⚖️ License
Proprietary — **All Rights Reserved**.

Unauthorized copying, modification, or distribution of this code via any medium is strictly prohibited. Produced for **The Morrigan** editorial platform.

---
**Vault Status:** 🟢 **HARDENED** | **Rank:** 📈 **SEO OPTIMIZED**
