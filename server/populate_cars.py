"""
populate_cars.py — Seeds the SQLite database with CarMake and CarModel data.
Run: python manage.py shell < populate_cars.py
Or:  python populate_cars.py (from server/ directory with DJANGO_SETTINGS_MODULE set)
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoproj.settings')
django.setup()

from djangoapp.models import CarMake, CarModel

CarMake.objects.all().delete()

cars = [
    {
        'make': 'Toyota',
        'description': 'Japanese multinational automotive manufacturer',
        'models': [
            ('Camry', 'SEDAN', 2022), ('Camry', 'SEDAN', 2023), ('Camry', 'SEDAN', 2024),
            ('RAV4', 'SUV', 2022), ('RAV4', 'SUV', 2023), ('RAV4', 'SUV', 2024),
            ('Corolla', 'SEDAN', 2022), ('Corolla', 'SEDAN', 2023),
            ('Tacoma', 'TRUCK', 2022), ('Tacoma', 'TRUCK', 2024),
        ],
    },
    {
        'make': 'Honda',
        'description': 'Japanese public multinational conglomerate manufacturer',
        'models': [
            ('Accord', 'SEDAN', 2022), ('Accord', 'SEDAN', 2023), ('Accord', 'SEDAN', 2024),
            ('CR-V', 'SUV', 2022), ('CR-V', 'SUV', 2023), ('CR-V', 'SUV', 2024),
            ('Civic', 'SEDAN', 2022), ('Civic', 'SEDAN', 2023),
            ('Pilot', 'SUV', 2022), ('Pilot', 'SUV', 2024),
        ],
    },
    {
        'make': 'Ford',
        'description': 'American multinational automobile manufacturer',
        'models': [
            ('F-150', 'TRUCK', 2022), ('F-150', 'TRUCK', 2023), ('F-150', 'TRUCK', 2024),
            ('Mustang', 'COUPE', 2022), ('Mustang', 'COUPE', 2023), ('Mustang', 'COUPE', 2024),
            ('Explorer', 'SUV', 2022), ('Explorer', 'SUV', 2023),
            ('Bronco', 'SUV', 2022), ('Bronco', 'SUV', 2024),
        ],
    },
    {
        'make': 'Chevrolet',
        'description': 'American automobile division of General Motors',
        'models': [
            ('Silverado', 'TRUCK', 2022), ('Silverado', 'TRUCK', 2023), ('Silverado', 'TRUCK', 2024),
            ('Equinox', 'SUV', 2022), ('Equinox', 'SUV', 2023), ('Equinox', 'SUV', 2024),
            ('Malibu', 'SEDAN', 2022), ('Malibu', 'SEDAN', 2023),
            ('Tahoe', 'SUV', 2022), ('Tahoe', 'SUV', 2024),
        ],
    },
    {
        'make': 'BMW',
        'description': 'German multinational corporate manufacturer of luxury vehicles',
        'models': [
            ('3 Series', 'SEDAN', 2022), ('3 Series', 'SEDAN', 2023), ('3 Series', 'SEDAN', 2024),
            ('5 Series', 'SEDAN', 2022), ('5 Series', 'SEDAN', 2023),
            ('X5', 'SUV', 2022), ('X5', 'SUV', 2023), ('X5', 'SUV', 2024),
            ('M4', 'COUPE', 2023), ('M4', 'COUPE', 2024),
        ],
    },
    {
        'make': 'Mercedes-Benz',
        'description': 'German luxury and commercial vehicle automotive brand',
        'models': [
            ('C-Class', 'SEDAN', 2022), ('C-Class', 'SEDAN', 2023), ('C-Class', 'SEDAN', 2024),
            ('E-Class', 'SEDAN', 2022), ('E-Class', 'SEDAN', 2023),
            ('GLE', 'SUV', 2022), ('GLE', 'SUV', 2023), ('GLE', 'SUV', 2024),
            ('AMG GT', 'COUPE', 2023), ('AMG GT', 'COUPE', 2024),
        ],
    },
    {
        'make': 'Tesla',
        'description': 'American electric vehicle and clean energy company',
        'models': [
            ('Model 3', 'SEDAN', 2022), ('Model 3', 'SEDAN', 2023), ('Model 3', 'SEDAN', 2024),
            ('Model Y', 'SUV', 2022), ('Model Y', 'SUV', 2023), ('Model Y', 'SUV', 2024),
            ('Model S', 'SEDAN', 2022), ('Model S', 'SEDAN', 2023),
            ('Cybertruck', 'TRUCK', 2024),
        ],
    },
    {
        'make': 'Hyundai',
        'description': 'South Korean multinational automotive manufacturer',
        'models': [
            ('Elantra', 'SEDAN', 2022), ('Elantra', 'SEDAN', 2023), ('Elantra', 'SEDAN', 2024),
            ('Tucson', 'SUV', 2022), ('Tucson', 'SUV', 2023), ('Tucson', 'SUV', 2024),
            ('Santa Fe', 'SUV', 2022), ('Santa Fe', 'SUV', 2023),
            ('Ioniq 6', 'SEDAN', 2023), ('Ioniq 6', 'SEDAN', 2024),
        ],
    },
]

for car in cars:
    make, _ = CarMake.objects.get_or_create(name=car['make'], defaults={'description': car['description']})
    for model_name, car_type, year in car['models']:
        CarModel.objects.get_or_create(
            car_make=make,
            name=model_name,
            car_type=car_type,
            year=year,
        )

print(f"Seeded {CarMake.objects.count()} makes and {CarModel.objects.count()} models")
