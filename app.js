// ===== PRESET TOPICS =====
const PRESET_TOPICS = [
    "TECHNOLOGY",
    "ARTIFICIAL INTELLIGENCE",
    "CRYPTOCURRENCY",
    "STOCK MARKET",
    "CLIMATE CHANGE",
    "SPORTS",
    "ENTERTAINMENT",
    "POLITICS",
    "SCIENCE",
    "HEALTH",
    "BUSINESS",
    "WORLD NEWS",
    "GAMING",
    "MOVIES",
    "MUSIC",
    "FASHION",
    "TRAVEL",
    "FOOD",
    "SPACE",
    "ELECTRIC VEHICLES"
];

// ===== STATE =====
let selectedTopics = new Set();
let customTopics = new Set();
let articles = [];
let starredArticles = new Set(); // Store starred article links
let currentLayout = 'grid';
let starredLayout = 'grid';

// Load starred from localStorage
function loadStarred() {
    const saved = localStorage.getItem('starredArticles');
    if (saved) {
        starredArticles = new Set(JSON.parse(saved));
    }
}

// Save starred to localStorage
function saveStarred() {
    localStorage.setItem('starredArticles', JSON.stringify([...starredArticles]));
}

// ===== DOM ELEMENTS =====
const topicsGrid = document.getElementById('topicsGrid');
const customInput = document.getElementById('customInput');
const addBtn = document.getElementById('addBtn');
const customTags = document.getElementById('customTags');
const clearBtn = document.getElementById('clearBtn');
const selectAllBtn = document.getElementById('selectAllBtn');
const scrapeBtn = document.getElementById('scrapeBtn');
const selectedCount = document.getElementById('selectedCount');
const newsGrid = document.getElementById('newsGrid');
const starredGrid = document.getElementById('starredGrid');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const emptyStarredState = document.getElementById('emptyStarredState');
const newsSubtitle = document.getElementById('newsSubtitle');
const starredSubtitle = document.getElementById('starredSubtitle');

// ===== INITIALIZATION =====
function init() {
    loadStarred();
    renderTopics();
    setupEventListeners();
    setupNavigation();
    setupLayoutControls();
    updateUI();
}

// ===== RENDER TOPICS =====
function renderTopics() {
    topicsGrid.innerHTML = PRESET_TOPICS.map(topic => `
        <div class="topic-item" data-topic="${topic}">${topic}</div>
    `).join('');

    document.querySelectorAll('.topic-item').forEach(item => {
        item.addEventListener('click', () => toggleTopic(item));
    });
}

// ===== TOGGLE TOPIC =====
function toggleTopic(item) {
    const topic = item.dataset.topic;

    if (selectedTopics.has(topic)) {
        selectedTopics.delete(topic);
        item.classList.remove('selected');
    } else {
        selectedTopics.add(topic);
        item.classList.add('selected');
    }

    updateUI();
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Add custom topic
    addBtn.addEventListener('click', addCustomTopic);
    customInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addCustomTopic();
    });

    // Clear all
    clearBtn.addEventListener('click', () => {
        selectedTopics.clear();
        customTopics.clear();
        document.querySelectorAll('.topic-item').forEach(item => {
            item.classList.remove('selected');
        });
        renderCustomTags();
        updateUI();
    });

    // Select all
    selectAllBtn.addEventListener('click', () => {
        PRESET_TOPICS.forEach(topic => selectedTopics.add(topic));
        document.querySelectorAll('.topic-item').forEach(item => {
            item.classList.add('selected');
        });
        updateUI();
    });

    // Start scraping
    scrapeBtn.addEventListener('click', startScraping);
}

// ===== NAVIGATION =====
function setupNavigation() {
    document.querySelectorAll('[data-view]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = link.dataset.view + 'View';

            // Update nav active state
            document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
            document.querySelector(`.nav-link[data-view="${link.dataset.view}"]`)?.classList.add('active');

            // Show view
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.getElementById(viewId)?.classList.add('active');

            // Render starred view if needed
            if (link.dataset.view === 'starred') {
                renderStarred();
            }
        });
    });

    // Set initial active
    document.querySelector('.nav-link[data-view="topics"]').classList.add('active');
}

// ===== LAYOUT CONTROLS =====
function setupLayoutControls() {
    // News layout controls
    document.querySelectorAll('#newsView .layout-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#newsView .layout-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLayout = btn.dataset.layout;
            applyLayout(newsGrid, currentLayout);
        });
    });

    // Starred layout controls
    document.querySelectorAll('#starredView .layout-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#starredView .layout-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            starredLayout = btn.dataset.layout;
            applyLayout(starredGrid, starredLayout);
        });
    });
}

function applyLayout(grid, layout) {
    grid.classList.remove('layout-grid', 'layout-list', 'layout-compact');
    if (layout !== 'grid') {
        grid.classList.add(`layout-${layout}`);
    }
}

// ===== ADD CUSTOM TOPIC =====
function addCustomTopic() {
    const topic = customInput.value.trim().toUpperCase();

    if (topic && !customTopics.has(topic) && !selectedTopics.has(topic)) {
        customTopics.add(topic);
        renderCustomTags();
        customInput.value = '';
        updateUI();
    }
}

// ===== RENDER CUSTOM TAGS =====
function renderCustomTags() {
    customTags.innerHTML = Array.from(customTopics).map(topic => `
        <div class="custom-tag">
            <span>${topic}</span>
            <button data-topic="${topic}">×</button>
        </div>
    `).join('');

    document.querySelectorAll('.custom-tag button').forEach(btn => {
        btn.addEventListener('click', () => {
            customTopics.delete(btn.dataset.topic);
            renderCustomTags();
            updateUI();
        });
    });
}

// ===== UPDATE UI =====
function updateUI() {
    const total = selectedTopics.size + customTopics.size;
    selectedCount.textContent = `${total} SELECTED`;
    scrapeBtn.disabled = total === 0;
}

// ===== TOGGLE STAR =====
function toggleStar(link) {
    if (starredArticles.has(link)) {
        starredArticles.delete(link);
    } else {
        starredArticles.add(link);
    }
    saveStarred();
    renderNews();
}

// ===== START SCRAPING =====
async function startScraping() {
    const allTopics = [...selectedTopics, ...customTopics];
    if (allTopics.length === 0) return;

    // Switch to news view
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    document.querySelector('.nav-link[data-view="news"]').classList.add('active');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('newsView').classList.add('active');

    // Show loading
    loadingState.classList.add('active');
    emptyState.classList.remove('active');
    newsGrid.style.display = 'none';

    try {
        // Fetch news from Google News RSS for each topic
        articles = [];

        for (const topic of allTopics) {
            const topicArticles = await fetchNews(topic);
            articles.push(...topicArticles);
        }

        // Remove duplicates by link
        const seen = new Set();
        articles = articles.filter(article => {
            if (seen.has(article.link)) return false;
            seen.add(article.link);
            return true;
        });

        // Update subtitle
        newsSubtitle.textContent = `${articles.length} ARTICLES FROM ${allTopics.length} TOPICS`;

        // Render articles
        renderNews();

    } catch (error) {
        console.error('Scraping error:', error);
        emptyState.classList.add('active');
    } finally {
        loadingState.classList.remove('active');
    }
}

// ===== FETCH NEWS =====
async function fetchNews(topic) {
    // Using RSS2JSON API to fetch Google News RSS
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=en-US&gl=US&ceid=US:en`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=10`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 'ok' && data.items) {
            return data.items.map(item => {
                // Extract source from title (format: "Title - Source")
                let title = item.title;
                let source = 'UNKNOWN';

                if (title.includes(' - ')) {
                    const parts = title.split(' - ');
                    source = parts.pop().toUpperCase();
                    title = parts.join(' - ');
                }

                return {
                    title: title.toUpperCase(),
                    source: source,
                    link: item.link,
                    pubDate: new Date(item.pubDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    }).toUpperCase(),
                    topic: topic
                };
            });
        }
        return [];
    } catch (error) {
        console.error(`Error fetching ${topic}:`, error);
        return [];
    }
}

// ===== RENDER NEWS =====
function renderNews() {
    if (articles.length === 0) {
        emptyState.classList.add('active');
        newsGrid.style.display = 'none';
        return;
    }

    newsGrid.style.display = 'grid';
    applyLayout(newsGrid, currentLayout);

    newsGrid.innerHTML = articles.map(article => `
        <article class="news-item">
            <button class="star-btn ${starredArticles.has(article.link) ? 'starred' : ''}" 
                    data-link="${article.link}" 
                    onclick="toggleStar('${article.link.replace(/'/g, "\\'")}')">
                ${starredArticles.has(article.link) ? '★' : '☆'}
            </button>
            <div class="news-topic">${article.topic}</div>
            <h2 class="news-title">
                <a href="${article.link}" target="_blank" rel="noopener noreferrer">
                    ${article.title}
                </a>
            </h2>
            <div class="news-meta">
                <span class="news-source">${article.source}</span>
                <span class="news-date">${article.pubDate}</span>
            </div>
        </article>
    `).join('');
}

// ===== RENDER STARRED =====
function renderStarred() {
    // Get starred articles from the articles array
    const starred = articles.filter(a => starredArticles.has(a.link));

    if (starred.length === 0) {
        emptyStarredState.classList.add('active');
        starredGrid.style.display = 'none';
        starredSubtitle.textContent = 'YOUR SAVED ARTICLES';
        return;
    }

    emptyStarredState.classList.remove('active');
    starredGrid.style.display = 'grid';
    applyLayout(starredGrid, starredLayout);
    starredSubtitle.textContent = `${starred.length} SAVED ARTICLES`;

    starredGrid.innerHTML = starred.map(article => `
        <article class="news-item">
            <button class="star-btn starred" 
                    data-link="${article.link}" 
                    onclick="toggleStarFromStarred('${article.link.replace(/'/g, "\\'")}')">
                ★
            </button>
            <div class="news-topic">${article.topic}</div>
            <h2 class="news-title">
                <a href="${article.link}" target="_blank" rel="noopener noreferrer">
                    ${article.title}
                </a>
            </h2>
            <div class="news-meta">
                <span class="news-source">${article.source}</span>
                <span class="news-date">${article.pubDate}</span>
            </div>
        </article>
    `).join('');
}

// Toggle star from starred view (also re-renders)
function toggleStarFromStarred(link) {
    starredArticles.delete(link);
    saveStarred();
    renderStarred();
    renderNews(); // Update news view too
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', init);

