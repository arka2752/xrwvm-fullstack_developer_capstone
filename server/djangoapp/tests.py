"""
djangoapp/tests.py — Unit tests for the Django app.
"""
from django.test import TestCase, Client
from django.contrib.auth.models import User
from .models import CarMake, CarModel


class AuthTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='testpass123')

    def test_login_success(self):
        response = self.client.post(
            '/djangoapp/login',
            data='{"userName":"testuser","password":"testpass123"}',
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'Authenticated')

    def test_login_failure(self):
        response = self.client.post(
            '/djangoapp/login',
            data='{"userName":"testuser","password":"wrongpass"}',
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 401)

    def test_registration(self):
        response = self.client.post(
            '/djangoapp/registration',
            data='{"userName":"newuser","password":"newpass123","firstName":"John","lastName":"Doe","email":"john@example.com"}',
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'Authenticated')

    def test_registration_duplicate(self):
        self.client.post(
            '/djangoapp/registration',
            data='{"userName":"dup","password":"pass123"}',
            content_type='application/json',
        )
        response = self.client.post(
            '/djangoapp/registration',
            data='{"userName":"dup","password":"pass123"}',
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 400)

    def test_logout(self):
        self.client.login(username='testuser', password='testpass123')
        response = self.client.get('/djangoapp/logout')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'Logged Out')


class CarDataTests(TestCase):
    def setUp(self):
        make = CarMake.objects.create(name='Toyota', description='Japanese automaker')
        CarModel.objects.create(car_make=make, name='Camry', car_type='SEDAN', year=2024)
        CarModel.objects.create(car_make=make, name='RAV4', car_type='SUV', year=2024)

    def test_get_cars(self):
        response = self.client.get('/djangoapp/get_cars')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data['CarModels']), 2)
