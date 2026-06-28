"""
djangoapp/views.py

REST API views for user management and proxying requests to Node/Sentiment services.
"""
import json
import logging
from pathlib import Path

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import CarMake, CarModel
from .restapis import get_request, post_request, analyze_review_sentiments

# Load local JSON as fallback if Node service isn't available
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DEALERSHIPS_JSON = BASE_DIR / 'database' / 'data' / 'dealerships.json'
REVIEWS_JSON = BASE_DIR / 'database' / 'data' / 'reviews.json'

with open(DEALERSHIPS_JSON, 'r') as f:
    FALLBACK_DEALERS = json.load(f)
with open(REVIEWS_JSON, 'r') as f:
    FALLBACK_REVIEWS = json.load(f)

logger = logging.getLogger(__name__)


# ─── Auth ────────────────────────────────────────────────────────────────────

@csrf_exempt
@require_http_methods(["POST"])
def login_user(request):
    data = json.loads(request.body)
    username = data.get('userName')
    password = data.get('password')
    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        return JsonResponse({'status': 'Authenticated', 'userName': username})
    return JsonResponse({'status': 'Failed', 'message': 'Invalid credentials'}, status=401)


@require_http_methods(["GET"])
def logout_user(request):
    logout(request)
    return JsonResponse({'userName': ''})


@csrf_exempt
@require_http_methods(["POST"])
def registration(request):
    data = json.loads(request.body)
    username = data.get('userName')
    password = data.get('password')
    first_name = data.get('firstName', '')
    last_name = data.get('lastName', '')
    email = data.get('email', '')

    if User.objects.filter(username=username).exists():
        return JsonResponse({'status': 'Failed', 'message': 'Username already taken'}, status=400)

    user = User.objects.create_user(
        username=username,
        password=password,
        first_name=first_name,
        last_name=last_name,
        email=email,
    )
    login(request, user)
    return JsonResponse({'status': 'Authenticated', 'userName': username})


# ─── Car Data ────────────────────────────────────────────────────────────────

@require_http_methods(["GET"])
def get_cars(request):
    makes = CarMake.objects.prefetch_related('models').all()
    data = []
    for make in makes:
        for model in make.models.all():
            data.append({
                'CarMake': make.name,
                'CarModel': model.name,
                'Year': model.year,
                'Type': model.car_type,
            })
    return JsonResponse({'CarModels': data})


# ─── Dealerships (proxy to Node service) ────────────────────────────────────

@require_http_methods(["GET"])
def get_dealerships(request, state='All'):
    if state == 'All':
        endpoint = '/fetchDealers'
        data = get_request(endpoint)
        if data is not None:
            return JsonResponse({'status': 200, 'dealers': data.get('dealers', [])})
        
        # Fallback to local JSON
        return JsonResponse({'status': 200, 'dealers': FALLBACK_DEALERS})
    else:
        endpoint = f'/fetchDealers/{state}'
        data = get_request(endpoint)
        if data is not None:
            return JsonResponse({'status': 200, 'dealers': data.get('dealers', [])})
        
        # Fallback to local JSON
        filtered = [d for d in FALLBACK_DEALERS if d['st'] == state.upper()]
        return JsonResponse({'status': 200, 'dealers': filtered})


@require_http_methods(["GET"])
def get_dealer_details(request, dealer_id):
    data = get_request(f'/fetchDealer/{dealer_id}')
    if data is not None:
        return JsonResponse({'status': 200, 'dealer': data.get('dealer', {})})
    
    # Fallback to local JSON
    dealer = next((d for d in FALLBACK_DEALERS if d['id'] == int(dealer_id)), None)
    return JsonResponse({'status': 200, 'dealer': dealer or {}})


# ─── Reviews (proxy + sentiment) ────────────────────────────────────────────

@require_http_methods(["GET"])
def get_dealer_reviews(request, dealer_id):
    data = get_request(f'/fetchReviews/{dealer_id}')
    if data is not None:
        reviews = data.get('reviews', [])
    else:
        # Fallback to local JSON
        reviews = [r for r in FALLBACK_REVIEWS if r['dealership'] == int(dealer_id)]

    # Enrich each review with sentiment if not already set
    for review in reviews:
        if not review.get('sentiment') or review['sentiment'] == 'neutral':
            result = analyze_review_sentiments(review.get('review', ''))
            review['sentiment'] = result.get('sentiment', 'neutral')

    return JsonResponse({'status': 200, 'reviews': reviews})


@csrf_exempt
@require_http_methods(["POST"])
def add_review(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 403, 'message': 'Authentication required'}, status=403)

    data = json.loads(request.body)

    # Run sentiment analysis before saving
    review_text = data.get('review', '')
    sentiment_result = analyze_review_sentiments(review_text)
    data['sentiment'] = sentiment_result.get('sentiment', 'neutral')
    data['name'] = request.user.get_full_name() or request.user.username
    data['id'] = len(FALLBACK_REVIEWS) + 1  # Temporary ID for demo

    result = post_request('/insertReview', data)
    if result is not None:
        return JsonResponse({'status': 200, 'review': result.get('review', {})})
    
    # Fallback: just return the data (in-memory only for demo)
    FALLBACK_REVIEWS.append(data)
    return JsonResponse({'status': 200, 'review': data})
