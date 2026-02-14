const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
const API_BASE_URL = isLocal ? 'http://localhost:8000/api' : '/api';

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initChatbot();

    if (document.getElementById('journal-grid')) {
        initJournal();
    } else if (document.querySelector('.category-section')) {
        initHomepage();
    } else if (document.getElementById('blog-content')) {

    }
});

function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        });
    }
}

async function initHomepage() {
    console.log("Initializing Homepage...");
    const sections = document.querySelectorAll('.category-section');
    for (const section of sections) {
        const category = section.dataset.category;
        const container = section.querySelector('.card-grid');
        if (category && container) {
            try {
                const response = await fetch(`${API_BASE_URL}/blogs?category=${category}&limit=3`);
                if (response.ok) {
                    const blogs = await response.json();
                    renderBlogCards(blogs, container);
                }
            } catch (e) { console.error(`Failed to fetch ${category}`, e); }
        }
    }
}

async function initJournal() {
    const grid = document.getElementById('journal-grid');
    const tabs = document.querySelectorAll('.tab-btn');
    const searchInput = document.getElementById('searchInput');

    const urlParams = new URLSearchParams(window.location.search);
    let currentCategory = urlParams.get('category') || 'all';

    const fetchAndRender = async (cat = 'all') => {
        grid.innerHTML = '<div class="loading">Loading insights...</div>';
        try {
            const url = cat === 'all' ? `${API_BASE_URL}/blogs` : `${API_BASE_URL}/blogs?category=${cat}`;
            const res = await fetch(url);
            const blogs = await res.json();
            grid.innerHTML = '';
            renderBlogCards(blogs, grid);
            if (blogs.length === 0) document.getElementById('no-results').style.display = 'block';
            else document.getElementById('no-results').style.display = 'none';
        } catch (e) { grid.innerHTML = 'Failed to load journal.'; }
    };

    tabs.forEach(tab => {
        if (tab.dataset.filter === currentCategory) {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        }
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            fetchAndRender(tab.dataset.filter);
        });
    });

    fetchAndRender(currentCategory);
}

function renderBlogCards(blogs, container) {
    if (!blogs.length) {
        container.innerHTML = '<p class="empty-msg">New insights coming soon.</p>';
        return;
    }
    container.innerHTML = blogs.map(blog => {
        const date = new Date(blog.published_at || blog.created_at).toLocaleDateString();
        const imageUrl = blog.featured_image || 'logo.png';
        return `
            <article class="card fade-in-up" onclick="location.href='blog-detail.html?slug=${blog.slug}'">
                <div class="card-image">
                    <img src="${imageUrl}" alt="${blog.title}" onerror="this.src='logo.png'">
                </div>
                <div class="card-content">
                    <div class="card-meta">
                        <span>${blog.category || 'General'}</span>
                        <span class="card-meta-dot"></span>
                        <span>${blog.read_time || 5} min read</span>
                    </div>
                    <h3 class="card-title">${blog.title}</h3>
                    <p class="card-description">${blog.excerpt || ''}</p>
                    <p class="card-date">${date}</p>
                </div>
            </article>
        `;
    }).join('');
}

function initChatbot() {
    const btn = document.querySelector('.chatbot-button');
    if (!btn) return;

    btn.onclick = () => {
        let chat = document.querySelector('.chatbot-container');
        if (chat) chat.classList.toggle('active');
        else createChatElement();
    };
}

function createChatElement() {
    const chat = document.createElement('div');
    chat.className = 'chatbot-container active';
    chat.innerHTML = `
        <div class="chatbot-header">
            <h3>Morrigan AI</h3>
            <button class="chatbot-close">×</button>
        </div>
        <div class="chatbot-messages" id="chatMsgs">
            <div class="bot-message">Hello. I am Morrigan. How can I assist your research today?</div>
        </div>
        <div class="chatbot-input-container">
            <input type="text" id="chatInput" placeholder="Ask about our insights...">
            <button id="chatSend">Send</button>
        </div>
    `;
    document.body.appendChild(chat);

    chat.querySelector('.chatbot-close').onclick = () => chat.classList.remove('active');
    const input = chat.querySelector('#chatInput');
    const send = chat.querySelector('#chatSend');

    const handleSend = async () => {
        const text = input.value.trim();
        if (!text) return;
        addMsg('user', text);
        input.value = '';

        const pageContent = document.body.innerText.slice(0, 5000);
        const urlParams = new URLSearchParams(window.location.search);

        try {
            showLoading();
            const res = await fetch(`${API_BASE_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    page_url: window.location.href,
                    page_content: pageContent,
                    blog_id: window.currentBlogId
                })
            });
            const data = await res.json();
            removeLoading();
            addMsg('bot', data.response);
        } catch (e) {
            removeLoading();
            addMsg('bot', "I'm having trouble connecting to my knowledge base.");
        }
    };

    send.onclick = handleSend;
    input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };
}

function addMsg(type, text) {
    const container = document.getElementById('chatMsgs');
    const div = document.createElement('div');
    div.className = `${type}-message`;

    div.innerHTML = window.marked ? marked.parse(text) : text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function showLoading() {
    const div = document.createElement('div');
    div.className = 'bot-message loading-dots';
    div.id = 'chat-loading';
    div.innerText = 'Morrigan is thinking...';
    document.getElementById('chatMsgs').appendChild(div);
}

function removeLoading() {
    const el = document.getElementById('chat-loading');
    if (el) el.remove();
}
