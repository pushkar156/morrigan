# Finance & IPO Journal 

This is a frontend web project created to serve as a comprehensive blog and news platform focusing on the Indian financial market. It covers in-depth case studies, recent IPOs, and the growth journeys of major Indian startups.

## Project Overview & Workflow
The goal of this project was to build a clean, interactive blog website with a fully functional content management flow and AI integration. It is divided into two main parts: a public-facing website for readers and a private admin interface.

**How it works:**
1. **Content Management:** Admins log into the panel to draft and upload blogs.
2. **State Tagging:** When an admin uploads a blog, they tag it as either `Published` or `Archived`. The main website dynamically fetches and displays only the blogs tagged as `Published`.
3. **AI Chatbot (RAG):** We implemented a smart chatbot for readers. When a user asks a question about a specific blog, the system uses a RAG (Retrieval-Augmented Generation) approach. It extracts chunks of text from the article being read and passes them to the **Gemini API**, which then generates an accurate, context-aware answer for the user.

## Key Features
* **Public Reader Interface:** * Home page (`index.html`) highlighting featured articles and market trends.
  * A Journal feed (`journal.html`) that only displays `Published` posts.
  * Dedicated `about.html` and `contact.html` pages.
  * **Interactive AI Chatbot:** Readers can ask questions about the current article and get instant, context-specific answers.
* **Admin Management Panel:**
  * Secure login portal (`admin/login.html`).
  * Admin dashboard (`admin/dashboard.html`) to oversee the blog and manage states (Publish/Archive).
  * Built-in text editor (`admin/editor.html`) to draft new articles.
* **Pre-loaded Case Studies:** Includes highly detailed, custom-written HTML pages and Word documents covering real-world Indian market events.

## Folder Structure
Here is a quick overview of how the repository is organized:
```text
├── index.html          # Main landing page
├── journal.html        # Main feed of all published blog posts
├── about.html          # About the website/team
├── contact.html        # Contact form page
├── styles.css          # Core stylesheet for the entire website
├── script.js           # Frontend logic, AI chatbot integration, and UI interactivity
├── demo-data.js        # Handles the dummy data and state tagging for the blog feed
├── admin/              # Folder containing backend UI (login, dashboard, editor)
└── [Article Files]     # Individual HTML/DOCX files for each company case study
