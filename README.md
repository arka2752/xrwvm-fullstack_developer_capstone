# 🚗 Best Cars Dealership — Capstone Project

A full-stack web application for browsing and reviewing car dealerships across the United States.

## Architecture

| Service | Technology | Port |
|---------|-----------|------|
| **Frontend** | React (SPA) | served by Django |
| **Backend API** | Django + SQLite | 8000 |
| **Data Service** | Node.js + Express + MongoDB | 3030 |
| **AI Service** | Flask + NLTK VADER | 5000 |

## Features

- 🏠 Home, About Us, Contact Us static pages
- 🗺️ Browse dealerships — filter by US state
- ⭐ Read reviews with **sentiment badges** (positive / neutral / negative)
- 🔐 Register and login to post your own review
- 🤖 Automatic sentiment analysis powered by NLTK VADER
- 🐳 Docker Compose for one-command local startup

## Project Structure

```
Capstone/
├── server/          # Django backend + React frontend
├── database/        # Node.js + Express + MongoDB service
├── sentiment/       # Flask + NLTK sentiment microservice
├── docker/          # Dockerfiles + docker-compose.yml
└── .github/         # GitHub Actions CI/CD
```

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB (local or Docker)

### 1. Start MongoDB (Docker)
```bash
docker run -d -p 27017:27017 --name mongo mongo:7
```

### 2. Node.js Database Service
```bash
cd database
npm install
npm run seed          # seed dealerships and reviews
npm start             # runs on http://localhost:3030
```

### 3. Flask Sentiment Service
```bash
cd sentiment
pip install -r requirements.txt
python app.py         # runs on http://localhost:5000
```

### 4. Django Backend
```bash
cd server
pip install -r requirements.txt
python manage.py migrate
python populate_cars.py   # seed car makes/models
python manage.py createsuperuser
python manage.py runserver  # runs on http://localhost:8000
```

### 5. React Frontend (development)
```bash
cd server/frontend
npm install
npm start    # runs on http://localhost:3000 (proxies API to Django)
```

### Or — Docker Compose (all services)
```bash
cd docker
docker compose up --build
```

## Running Tests

```bash
# Django tests
cd server
python manage.py test djangoapp
```

## API Endpoints

### Django (`localhost:8000/djangoapp/`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/login` | No | Authenticate user |
| GET | `/logout` | Yes | Log out |
| POST | `/registration` | No | Register new user |
| GET | `/get_cars` | No | List all car makes/models |
| GET | `/get_dealerships` | No | All dealerships |
| GET | `/get_dealerships/<state>` | No | Filter by 2-letter state |
| GET | `/get_dealer_details/<id>` | No | Single dealership |
| GET | `/get_dealer_reviews/<id>` | No | Reviews with sentiment |
| POST | `/add_review` | **Yes** | Submit a review |

### Node.js service (`localhost:3030/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/fetchDealers` | All dealers |
| GET | `/fetchDealers/:state` | Dealers by state |
| GET | `/fetchDealer/:id` | Single dealer |
| GET | `/fetchReviews/:id` | Reviews for dealer |
| POST | `/insertReview` | Add review |

### Sentiment service (`localhost:5000/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analyze/<text>` | Sentiment of text |

## CI/CD

GitHub Actions runs on every push to `main` or `develop`:
- ✅ Python lint (flake8)
- ✅ Django unit tests
- ✅ React build
- ✅ Docker image build check

## License

MIT — IBM Capstone Project
