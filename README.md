# News Scraper

A minimalist news aggregator with topic-based scraping. Features a web interface inspired by high-fashion design aesthetics (Balenciaga) and a Python CLI for automated scraping.

## Features

### Web Interface
- Topic selection grid with 20 preset categories
- Custom topic input for specialized searches
- Live news fetching from Google News
- Star/save articles for later reading (persisted locally)
- Three layout modes: Grid, List, and Compact
- Responsive design for all screen sizes

### Python CLI
- Command-line interface for automated scraping
- Interactive topic selection menu
- CSV export with full metadata
- Deduplication of articles across topics

## Project Structure

```
.
├── index.html          # Web interface
├── styles.css          # Stylesheet
├── app.js              # Frontend logic
├── scraper.py          # Python CLI scraper
├── requirements.txt    # Python dependencies
└── trending_news.csv   # Output file (generated)
```

## Getting Started

### Web Interface

Simply open `index.html` in any modern browser. No server required.

1. Select topics from the grid or add custom topics
2. Click "Start Scraping" to fetch articles
3. Star articles to save them
4. Switch between layouts using the toggle buttons

### Python CLI

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the scraper:
```bash
python scraper.py
```

3. Follow the interactive prompts to select topics

## Output Format

The CSV file contains the following columns:

| Column | Description |
|--------|-------------|
| title | Article headline |
| source | News source/publisher |
| topic | Category the article was fetched under |
| published_date | Publication timestamp |
| link | URL to the full article |
| fetched_at | Scrape timestamp |

## Tech Stack

- HTML5 / CSS3 / JavaScript (Vanilla)
- Python 3.x with feedparser
- Google News RSS

## License

MIT License
