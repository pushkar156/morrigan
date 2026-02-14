# Morrigan | Perspectives on Modern Intelligence

Morrigan is a sophisticated, AI-powered editorial platform focused on finance, business strategy, and technology. It features a custom CMS, a RAG-based chatbot (Retrieval-Augmented Generation), and a premium editorial design.

## 🔄 The Morrigan Ecosystem (The Correct Flow)

### 1. The Ingestion Flow (Learning)
*   **Editor**: Admin creates a blog post with rich text and images.
*   **Database**: The blog is saved to **PostgreSQL** (Source of Truth).
*   **RAG Pipeline**: 
    1.  Content is cleaned of HTML.
    2.  Text is split into semantic **Chunks**.
    3.  Each chunk is converted into a **Vector Embedding** via Gemini.
    4.  Vectors + Metadata (Blog ID, Title, Text) are stored in **Pinecone**.

### 2. The Interaction Flow (Q&A)
*   **User Question**: A visitor asks a question in the chatbot.
*   **Embedding**: The question is converted into **one vector**.
*   **Retrieval**: Pinecone performs a similarity search to find the most relevant **chunks** from across all blogs.
*   **Generation**: Gemini receives the question + the retrieved chunks and provides a context-rich, authoritative answer.

---

## 🏗️ Project Roadmap & Phase-wise TODO

### Phase 1: Frontend Settlement (Current Focus) 🟢
The goal is to finalize the design system, navigation, and all core user-facing pages.
- [ ] **Core Styles**: Verify `Web/styles.css` is consistent and optimized for premium aesthetics.
- [ ] **Homepage**: Finalize dynamic section rendering (fetching from API).
- [ ] **Journal**: Ensure category filtering and search UI are polished.
- [ ] **Blog Detail**: Clean up the reading experience (typography, spacing, responsive images).
- [ ] **Static Pages**: Finalize 'About' and 'Contact' page layouts.
- [ ] **Navigation**: Sync mobile menu and active link states across all pages.

### Phase 2: Content Management & Foundation 🟡
Finalizing the Admin interface and critical backend services.
- [ ] **Database Setup**: Initialize PostgreSQL tables (Blogs, Contacts, etc.).
- [ ] **Auth System**: Finalize admin login and JWT token management.
- [ ] **Admin Dashboard**: Implement table views for managing posts.
- [ ] **The Editor**: Restore `upload.py` and refine the Quill.js editor (Image resizing, local uploads).
- [ ] **Form Handling**: Connect the Contact page to the backend.

### Phase 3: AI Intelligence (RAG) 🔴
Bringing the "Morrigan AI" to life.
- [ ] **Env Config**: Validate all Gemini and Pinecone keys in `.env`.
- [ ] **Ingestion Service**: Test the cleaning/chunking/embedding logic.
- [ ] **Chat API**: Connect the frontend chat window to the backend RAG service.
- [ ] **Context Sensing**: Ensure the bot knows which page the user is currently viewing.

---

## 🚀 Getting Started

1.  **Backend Setup**:
    ```bash
    cd Backend
    pip install -r requirements.txt
    # Configure your .env file
    python main.py
    ```
2.  **Frontend**:
    Serve the `Web/` directory (automatically handled by the FastAPI backend at `/static`).
