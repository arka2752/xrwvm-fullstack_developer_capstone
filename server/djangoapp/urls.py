from django.urls import path
from . import views

app_name = 'djangoapp'

urlpatterns = [
    # Auth
    path('login', views.login_user, name='login'),
    path('logout', views.logout_user, name='logout'),
    path('registration', views.registration, name='registration'),

    # Car data
    path('get_cars', views.get_cars, name='get_cars'),

    # Dealerships
    path('get_dealerships', views.get_dealerships, name='get_dealerships'),
    path('get_dealerships/<str:state>', views.get_dealerships, name='get_dealerships_by_state'),
    path('get_dealer_details/<int:dealer_id>', views.get_dealer_details, name='get_dealer_details'),

    # Reviews
    path('get_dealer_reviews/<int:dealer_id>', views.get_dealer_reviews, name='get_dealer_reviews'),
    path('add_review', views.add_review, name='add_review'),
]
