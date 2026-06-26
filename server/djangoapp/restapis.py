"""
djangoapp/restapis.py

HTTP client functions that communicate with the Node.js and Sentiment microservices.
"""
import requests
from django.conf import settings


def get_request(endpoint, **kwargs):
    """Make a GET request to the Node.js service."""
    params = kwargs
    url = f"{settings.NODE_SERVICE_URL}{endpoint}"
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"[restapis] GET {url} failed: {e}")
        return None


def post_request(endpoint, payload):
    """Make a POST request to the Node.js service."""
    url = f"{settings.NODE_SERVICE_URL}{endpoint}"
    try:
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"[restapis] POST {url} failed: {e}")
        return None


def analyze_review_sentiments(text):
    """Call the Flask sentiment microservice."""
    import urllib.parse
    encoded_text = urllib.parse.quote(text, safe='')
    url = f"{settings.SENTIMENT_SERVICE_URL}/analyze/{encoded_text}"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"[restapis] Sentiment analysis failed: {e}")
        return {"sentiment": "neutral"}
