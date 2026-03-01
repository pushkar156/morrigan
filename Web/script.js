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
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.innerHTML = menu.classList.contains('active') ? '✕' : '☰';
        });

        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.nav-link');
            if (link && window.innerWidth <= 768) {
                link.addEventListener('click', (e) => {
                    if (dropdown.querySelector('.dropdown-menu')) {
                        e.preventDefault();
                        dropdown.classList.toggle('open');
                    }
                });
            }
        });

        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                menu.classList.remove('active');
                toggle.innerHTML = '☰';
            });
        });

        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('active')) {
                menu.classList.remove('active');
                toggle.innerHTML = '☰';
            }
        });
    }
}

async function initHomepage() {
    const blogs = window.DEMO_BLOGS || [];
    if (blogs.length > 0) {
        loadCategorySection('back-to-basics', blogs);
        loadCategorySection('case-studies', blogs);
        loadCategorySection('stock-analysis', blogs);
        loadCategorySection('100-days-challenge', blogs);
        loadCategorySection('ma-diaries', blogs);
    } else {
        try {
            const res = await fetch(`${API_BASE_URL}/blogs?limit=20`);
            const apiBlogs = await res.json();
            loadCategorySection('back-to-basics', apiBlogs);
            loadCategorySection('case-studies', apiBlogs);
            loadCategorySection('stock-analysis', apiBlogs);
            loadCategorySection('100-days-challenge', apiBlogs);
            loadCategorySection('ma-diaries', apiBlogs);
        } catch (e) {
        }
    }
}

function loadCategorySection(category, allBlogs) {
    const container = document.getElementById(`${category}-scroll`);
    if (!container) return;
    const categoryBlogs = allBlogs.filter(blog => blog.category === category);
    if (categoryBlogs.length === 0) {
        container.innerHTML = '<p style="color: #999; padding: 2rem 0;">No articles available yet.</p>';
        return;
    }
    container.innerHTML = categoryBlogs.map(blog => {
        const date = new Date(blog.published_at || blog.created_at || Date.now()).toLocaleDateString();
        const imageUrl = blog.featured_image || 'logo.png';
        const categoryDisplay = blog.category ? blog.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'General';
        return `
            <div class="horizontal-card" onclick="location.href='blog-detail.html?slug=${blog.slug}'">
                <img src="${imageUrl}" alt="${blog.title}" class="horizontal-card-image" onerror="this.src='logo.png'">
                <div class="horizontal-card-content">
                    <div class="horizontal-card-category">${categoryDisplay}</div>
                    <h3 class="horizontal-card-title">${blog.title}</h3>
                    <p class="horizontal-card-excerpt">${blog.excerpt || ''}</p>
                    <div class="horizontal-card-meta">
                        <span>${date}</span>
                        <span>•</span>
                        <span>${blog.read_time || 5} min read</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function initJournal() {
    const grid = document.getElementById('journal-grid');
    const tabs = document.querySelectorAll('.tab-btn');
    const searchInput = document.getElementById('searchInput');
    const urlParams = new URLSearchParams(window.location.search);
    let currentCategory = urlParams.get('category') || 'all';
    let allBlogs = [];
    tabs.forEach(tab => {
        if (tab.dataset.filter === currentCategory) {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        }
    });

    const fetchAndRender = async (cat = 'all', searchTerm = '') => {
        grid.innerHTML = '<div style="text-align: center; padding: 3rem; color: #999;">Loading...</div>';
        try {
            if (window.DEMO_BLOGS && window.DEMO_BLOGS.length > 0) {
                allBlogs = window.DEMO_BLOGS;
                let filteredBlogs = cat === 'all' ? allBlogs : allBlogs.filter(blog => blog.category === cat);
                if (searchTerm) {
                    filteredBlogs = filteredBlogs.filter(blog =>
                        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (blog.excerpt && blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
                    );
                }
                grid.innerHTML = '';
                renderJournalCards(filteredBlogs, grid);
                if (filteredBlogs.length === 0) {
                    document.getElementById('no-results').style.display = 'block';
                } else {
                    document.getElementById('no-results').style.display = 'none';
                }
            } else {
                const url = cat === 'all' ? `${API_BASE_URL}/blogs` : `${API_BASE_URL}/blogs?category=${cat}`;
                const res = await fetch(url);
                allBlogs = await res.json();
                let filteredBlogs = allBlogs;
                if (searchTerm) {
                    filteredBlogs = allBlogs.filter(blog =>
                        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (blog.excerpt && blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
                    );
                }
                grid.innerHTML = '';
                renderJournalCards(filteredBlogs, grid);
                if (filteredBlogs.length === 0) {
                    document.getElementById('no-results').style.display = 'block';
                } else {
                    document.getElementById('no-results').style.display = 'none';
                }
            }
        } catch (e) {
            grid.innerHTML = '<div style="text-align: center; padding: 3rem; color: #999;">Failed to load articles.</div>';
        }
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.filter;
            fetchAndRender(currentCategory, searchInput.value);
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            fetchAndRender(currentCategory, e.target.value);
        });
    }

    fetchAndRender(currentCategory);
}

function renderJournalCards(blogs, container) {
    if (!blogs.length) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 3rem;">No articles available yet.</p>';
        return;
    }
    container.innerHTML = blogs.map(blog => {
        const date = new Date(blog.published_at || blog.created_at).toLocaleDateString();
        const imageUrl = blog.featured_image || 'logo.png';
        const categoryDisplay = blog.category ? blog.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'General';
        return `
            <div class="blog-card" onclick="location.href='blog-detail.html?slug=${blog.slug}'">
                <img src="${imageUrl}" alt="${blog.title}" class="blog-card-image" onerror="this.src='logo.png'">
                <div class="blog-card-content">
                    <div class="blog-card-category">${categoryDisplay}</div>
                    <h3 class="blog-card-title">${blog.title}</h3>
                    <p class="blog-card-excerpt">${blog.excerpt || ''}</p>
                    <div class="blog-card-meta">
                        <span>${date}</span>
                        <span>•</span>
                        <span>${blog.read_time || 5} min read</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
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
            <h3>Morrigan</h3>
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
