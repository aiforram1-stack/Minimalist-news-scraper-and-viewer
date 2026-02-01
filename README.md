# Minimalist News Scraper

A no-nonsense news aggregator that cuts through the noise. Pick your regions, choose your topics, get the headlines, save what matters. No algorithmic feeds, no clickbait recommendations, no endless scrolling traps.

## Screenshots

### Region & Topic Selection
Select from 40+ countries and 20 topic categories. Multi-select supported for both.

![Topic Selection](screenshots/topics.png)

### News Grid View
Headlines from multiple sources and regions, organized and scannable. Star articles to save them.

![News Grid](screenshots/news-grid.png)

### List View
Denser format for power readers. Switch layouts with one click.

![News List](screenshots/news-list.png)

## What's New

- **Multi-region support** - Aggregate news from USA, UK, India, China, Japan, Germany, and 30+ more countries
- **Star articles** - Save articles for later (persisted in browser storage)
- **Three layouts** - Grid, List, and Compact views
- **Balenciaga-inspired design** - High-fashion minimalist aesthetic

## Why This Exists

Most news apps want your attention. This one respects your time.

- **No infinite scroll** - You see what you asked for, nothing more
- **No algorithmic feed** - You choose the topics, not an algorithm
- **No tracking** - Runs entirely in your browser, no analytics
- **No account** - Open the page and start reading
- **No ads** - Clean interface, zero distractions

## Features

### Web Interface
- **40+ regions** - USA, UK, India, China, Japan, Germany, France, Russia, Brazil, and more
- **Multi-region support** - Fetch news from multiple countries simultaneously
- **20 preset categories** - Technology, AI, Sports, Business, Entertainment, etc.
- **Custom topics** - Add any topic you want
- **Three layouts** - Grid for scanning, List for reading, Compact for power users
- **Star articles** - Save them for later (stored locally)
- **Direct links** - No interstitial pages, straight to the source

### Python CLI
For automation and batch processing:
- Interactive topic selection
- Export to CSV with full metadata
- Automatic deduplication across topics
- Run it on a schedule with cron

## Quick Start

### Web Interface
Open `index.html` in any browser. That's it.

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
- Google News RSS with multi-region support

## License

MIT
