# 🏛️ The Morrigan: Elite Financial Intelligence Platform

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

## 👥 Contributors

This platform is a collaborative effort between:

*   **[Pushkar](https://github.com/pushkar156)** — Lead Architect, Full-Stack Developer, and Content Strategist.
*   **Antigravity (AI Assistant)** — Security Audit Specialist, Backend Hardening, and SEO Strategist (Designed by Google DeepMind).

---

## ⚖️ License
Distributed under the **MIT License**. See `LICENSE` for more information.

---
**Vault Status:** 🟢 **HARDENED** | **Rank:** 📈 **SEO OPTIMIZED**
