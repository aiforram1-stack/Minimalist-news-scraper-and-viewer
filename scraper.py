#!/usr/bin/env python3
"""
News Scraper CLI
Fetches news from Google News RSS feed and saves to CSV.
Supports topic selection with preset options and custom input.
"""

import csv
import feedparser
from datetime import datetime
from typing import List, Dict
import html


# Preset topic categories
PRESET_TOPICS = [
    "Technology",
    "Artificial Intelligence",
    "Cryptocurrency",
    "Stock Market",
    "Climate Change",
    "Sports",
    "Entertainment",
    "Politics",
    "Science",
    "Health",
    "Business",
    "World News",
    "Gaming",
    "Movies",
    "Music",
    "Fashion",
    "Travel",
    "Food",
    "Space Exploration",
    "Electric Vehicles"
]


def display_topic_menu():
    """Display the topic selection menu."""
    print("\n" + "=" * 60)
    print("  SELECT TOPICS TO SCRAPE")
    print("=" * 60)
    print("\nAvailable Topics:\n")
    
    # Display topics in two columns
    for i in range(0, len(PRESET_TOPICS), 2):
        left = f"  [{i+1:2}] {PRESET_TOPICS[i]}"
        if i + 1 < len(PRESET_TOPICS):
            right = f"[{i+2:2}] {PRESET_TOPICS[i+1]}"
            print(f"{left:<30} {right}")
        else:
            print(left)
    
    print("\n" + "-" * 60)
    print("OPTIONS:")
    print("   - Enter numbers separated by commas (e.g., 1,3,5)")
    print("   - Type 'all' to select all topics")
    print("   - Type custom topics separated by commas")
    print("   - Mix both (e.g., 1,3,Python,Machine Learning)")
    print("-" * 60)


def get_user_topics() -> List[str]:
    """
    Get topic selection from user.
    
    Returns:
        List of selected topic strings
    """
    display_topic_menu()
    
    user_input = input("\nEnter your selection: ").strip()
    
    if not user_input:
        print("No selection made. Using default 'trending' topic.")
        return ["trending"]
    
    if user_input.lower() == 'all':
        print(f"Selected all {len(PRESET_TOPICS)} topics")
        return PRESET_TOPICS.copy()
    
    selected_topics = []
    items = [item.strip() for item in user_input.split(',')]
    
    for item in items:
        if item.isdigit():
            index = int(item)
            if 1 <= index <= len(PRESET_TOPICS):
                topic = PRESET_TOPICS[index - 1]
                if topic not in selected_topics:
                    selected_topics.append(topic)
                    print(f"  + Added: {topic}")
            else:
                print(f"  ! Invalid number: {item} (must be 1-{len(PRESET_TOPICS)})")
        elif item:
            # Custom topic
            if item not in selected_topics:
                selected_topics.append(item)
                print(f"  + Added custom topic: {item}")
    
    if not selected_topics:
        print("No valid topics selected. Using default 'trending' topic.")
        return ["trending"]
    
    print(f"\nTotal topics selected: {len(selected_topics)}")
    return selected_topics


def fetch_google_news(query: str = "trending", max_results: int = 20) -> List[Dict]:
    """
    Fetch news articles from Google News RSS feed.
    
    Args:
        query: Search query for news (default: "trending")
        max_results: Maximum number of articles to fetch
    
    Returns:
        List of dictionaries containing article data
    """
    base_url = "https://news.google.com/rss/search"
    url = f"{base_url}?q={query}&hl=en-US&gl=US&ceid=US:en"
    
    print(f"Fetching news for: '{query}'...")
    
    try:
        feed = feedparser.parse(url)
        
        if feed.bozo:
            print(f"Warning: Feed parsing had issues: {feed.bozo_exception}")
        
        articles = []
        for entry in feed.entries[:max_results]:
            # Extract source from title (Google News format: "Title - Source")
            title = html.unescape(entry.get('title', 'No title'))
            source = "Unknown"
            
            if ' - ' in title:
                parts = title.rsplit(' - ', 1)
                if len(parts) == 2:
                    title = parts[0]
                    source = parts[1]
            
            # Parse published date
            published = entry.get('published', '')
            try:
                pub_date = datetime(*entry.published_parsed[:6]).strftime('%Y-%m-%d %H:%M:%S')
            except (AttributeError, TypeError):
                pub_date = published or 'Unknown'
            
            article = {
                'title': title,
                'source': source,
                'published_date': pub_date,
                'link': entry.get('link', ''),
                'topic': query,
                'fetched_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            articles.append(article)
        
        print(f"Fetched {len(articles)} articles for '{query}'")
        return articles
        
    except Exception as e:
        print(f"Error fetching news for '{query}': {e}")
        return []


def save_to_csv(articles: List[Dict], filename: str = "trending_news.csv") -> bool:
    """
    Save articles to a CSV file.
    
    Args:
        articles: List of article dictionaries
        filename: Output CSV filename
    
    Returns:
        True if successful, False otherwise
    """
    if not articles:
        print("No articles to save")
        return False
    
    fieldnames = ['title', 'source', 'topic', 'published_date', 'link', 'fetched_at']
    
    try:
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(articles)
        
        print(f"Saved {len(articles)} articles to '{filename}'")
        return True
        
    except Exception as e:
        print(f"Error saving to CSV: {e}")
        return False


def main():
    """Main entry point for the news scraper."""
    print("\n" + "=" * 60)
    print("  NEWS SCRAPER")
    print("=" * 60)
    
    # Get user's topic selection
    selected_topics = get_user_topics()
    
    print("\n" + "=" * 60)
    print("FETCHING NEWS...")
    print("=" * 60 + "\n")
    
    # Fetch news for each selected topic
    all_articles = []
    for topic in selected_topics:
        articles = fetch_google_news(query=topic, max_results=15)
        all_articles.extend(articles)
    
    # Deduplicate by link
    seen_links = set()
    unique_articles = []
    for article in all_articles:
        if article['link'] not in seen_links:
            seen_links.add(article['link'])
            unique_articles.append(article)
    
    # Save to CSV
    print("\n" + "-" * 60)
    if save_to_csv(unique_articles):
        print("\n" + "=" * 60)
        print("SCRAPING COMPLETED")
        print("=" * 60)
        print(f"Topics scraped: {len(selected_topics)}")
        print(f"Total unique articles: {len(unique_articles)}")
        print(f"Output file: trending_news.csv")
    else:
        print("\nScraping completed with issues")
    
    print("\n" + "=" * 60 + "\n")


if __name__ == "__main__":
    main()
