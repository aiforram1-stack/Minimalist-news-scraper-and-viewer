# Minimalist News Scraper

A no-nonsense news aggregator that cuts through the noise. Pick your regions, choose your topics, get the headlines, save what matters. No algorithmic feeds, no clickbait recommendations, no endless scrolling traps.

## Screenshots

### Region & Topic Selection
Select from 40+ countries (USA, UK, India, China, Japan, Germany, and more) and 20 topic categories. Multi-select both regions and topics to aggregate news from multiple sources.

![Topic Selection](screenshots/topics.png)

### News Grid View
Headlines from your selected regions and sources, organized in a clean grid. Star any article to save it for later.

![News Grid](screenshots/news-grid.png)

### List View
Switch to a denser list format with one click. Three layouts available: Grid, List, and Compact.

![News List](screenshots/news-list.png)

## Why This Exists

Most news apps want your attention. This one respects your time.

- **No infinite scroll** - You see what you asked for, nothing more
- **No algorithmic feed** - You choose the topics and regions, not an algorithm
- **No tracking** - Runs entirely in your browser, no analytics
- **No account** - Open the page and start reading
- **No ads** - Clean interface, zero distractions

## Features

### Web Interface
- **40+ regions** - USA, UK, India, China, Japan, Germany, France, Russia, Brazil, Australia, Canada, South Korea, and many more
- **Multi-region aggregation** - Fetch news from multiple countries at once
- **20 preset categories** - Technology, AI, Crypto, Sports, Business, Entertainment, Politics, Science, Health, and more
- **Custom topics** - Add any topic you want
- **Three layouts** - Grid for scanning, List for reading, Compact for power users
- **Star articles** - Save them for later (stored locally in your browser)
- **Direct links** - No interstitial pages, straight to the source

### Python CLI
For automation and batch processing:
- Interactive topic selection
- Export to CSV with full metadata
- Automatic deduplication across topics
- Schedule with cron for daily news digests

## Quick Start

### Web Interface
Open `index.html` in any browser. No build step, no dependencies.

### Python CLI
```bash
pip install -r requirements.txt
python scraper.py
```

## Project Structure

```
├── index.html          Web interface
├── styles.css          Balenciaga-inspired minimalist design
├── app.js              Frontend logic
├── scraper.py          Python CLI
├── requirements.txt    Python dependencies
└── screenshots/        Interface screenshots
```

## Data Sources

Articles are fetched from Google News RSS feeds with region-specific parameters. Each article includes:
- Headline
- Source publication
- Topic category
- Publication date
- Direct link to original article

## Tech Stack

- Vanilla HTML/CSS/JavaScript (no frameworks, no build step)
- Python 3 with feedparser
- Google News RSS with region and language support

## License

MIT
