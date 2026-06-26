"""
sentiment/app.py

Flask microservice that performs sentiment analysis on text using NLTK VADER.

Endpoint:
  GET /analyze/<text>   → { "sentiment": "positive" | "negative" | "neutral" }
"""

import nltk
from flask import Flask, jsonify
from nltk.sentiment.vader import SentimentIntensityAnalyzer

# Download VADER lexicon on first run
nltk.download('vader_lexicon', quiet=True)

app = Flask(__name__)
sia = SentimentIntensityAnalyzer()


@app.route('/analyze/<path:text>', methods=['GET'])
def analyze(text):
    """Analyze the sentiment of the given text."""
    scores = sia.polarity_scores(text)
    compound = scores['compound']

    if compound >= 0.05:
        sentiment = 'positive'
    elif compound <= -0.05:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'

    return jsonify({
        'text': text,
        'sentiment': sentiment,
        'scores': scores,
    })


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'sentiment-service'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
