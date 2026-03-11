# TravS — Travel Experience Platform

## Project Overview

A full-stack web platform where experience providers can register and publish travel listings, and travelers can browse a public feed to discover unique local experiences. Built as part of the TravS full-stack engineering internship technical challenge.

## Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Frontend   | React 18 + Vite             |
| Styling    | Tailwind CSS                |
| Backend    | Django 4.x + DRF            |
| Auth       | JWT via SimpleJWT           |
| Database   | MySQL 8                     |
| Deployment | Vercel (FE) + Render (BE)   |

## Setup Instructions

### Prerequisites

- Node.js 18+, Python 3.11+, MySQL 8

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in DB credentials + SECRET_KEY
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:8000/api
npm run dev
```

## Features Implemented

### Required

- [x] User registration, login, logout
- [x] JWT authentication with token refresh
- [x] Create travel experience listing
- [x] Public feed (newest first, paginated)
- [x] Listing detail page

### Optional

- [x] Edit listing (owner only)
- [x] Delete listing (owner only)
- [x] Search listings
- [x] Like / save listing
- [x] Responsive mobile UI

## Architecture & Key Decisions

### Why this stack?

React + Vite was chosen for fast HMR and modern bundling. Django REST Framework provides a clean serializer/viewset pattern that ships CRUD APIs with minimal boilerplate. MySQL was chosen for relational integrity and strong Django ORM support.

### How does authentication work?

Stateless JWT auth via SimpleJWT. On login the backend issues an access token (15 min) and refresh token (7 days). The Axios interceptor attaches the access token to every request and silently refreshes it on 401, giving users a seamless session.

### How are travel listings stored?

Listings live in a MySQL `listings` table with a FK to `users`. The `created_at` column is indexed for feed ordering. A FULLTEXT index on title, location, and description powers search. Price is nullable `DECIMAL(10,2)` — null means free.

### One improvement with more time

Image upload (replacing image URL input) via Django FileField + Cloudinary, with server-side resize to WebP. This removes friction and makes the platform feel polished.

## Scaling to 10,000 Listings

With 10,000 listings, I would: (1) Add DB indexes on `created_at` and a FULLTEXT index on searchable fields. (2) Switch from OFFSET pagination to cursor-based keyset pagination. (3) Cache the public feed in Redis with a short TTL. (4) Use Django `select_related` to eliminate N+1 queries. (5) Add virtual scrolling and image lazy-loading on the frontend. Together these changes keep feed load time under 200ms even at scale.

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── api/                  # Axios instance + API call functions
│   │   ├── axiosInstance.js
│   │   ├── authApi.js
│   │   └── listingsApi.js
│   ├── components/           # Reusable UI components
│   │   ├── ListingCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── SearchBar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/                # Route-level page components
│   │   ├── Feed.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ListingDetail.jsx
│   │   ├── CreateListing.jsx
│   │   ├── EditListing.jsx
│   │   └── Profile.jsx
│   ├── store/                # Zustand stores
│   │   ├── authStore.js
│   │   └── listingStore.js
│   ├── hooks/                # Custom React hooks
│   │   └── useAuth.js
│   ├── utils/                # Date formatters, validators
│   │   └── timeAgo.js
│   ├── App.jsx               # Router setup
│   └── main.jsx              # Entry point
├── .env.example
└── vite.config.js

backend/
├── config/                   # Django project settings
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── accounts/             # User model, auth views, serializers
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   └── listings/             # Listing model, views, serializers
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── permissions.py    # IsOwnerOrReadOnly
│       ├── filters.py        # Search filter class
│       └── urls.py
├── requirements.txt
├── manage.py
└── .env.example
```

## API Reference

Base URL (local): `http://localhost:8000/api/`

### Authentication

| Method | Endpoint              | Auth     | Description                        |
|--------|-----------------------|----------|------------------------------------|
| POST   | /auth/register/       | Public   | Register new user account          |
| POST   | /auth/login/          | Public   | Login → returns access + refresh tokens |
| POST   | /auth/logout/         | Required | Blacklist refresh token            |
| POST   | /auth/token/refresh/  | Public   | Exchange refresh → new access token |
| GET    | /auth/me/             | Required | Get current authenticated user profile |

### Listings

| Method | Endpoint               | Auth       | Description                              |
|--------|------------------------|------------|------------------------------------------|
| GET    | /listings/             | Public     | List all listings (newest first). Supports `?search=` and `?page=` |
| POST   | /listings/             | Required   | Create a new listing                     |
| GET    | /listings/{id}/        | Public     | Retrieve a single listing detail         |
| PUT    | /listings/{id}/        | Owner only | Full update a listing                    |
| PATCH  | /listings/{id}/        | Owner only | Partial update a listing                 |
| DELETE | /listings/{id}/        | Owner only | Delete a listing                         |
| POST   | /listings/{id}/like/   | Required   | Toggle like on a listing                 |
| POST   | /listings/{id}/save/   | Required   | Toggle save/bookmark on a listing        |
| GET    | /listings/saved/       | Required   | Get current user's saved listings        |

## Frontend Routes

| Route              | Guard       | Component        | Purpose                        |
|--------------------|-------------|------------------|--------------------------------|
| /                  | Public      | `<Feed />`       | Main listings feed with search |
| /register          | Guest only  | `<Register />`   | New account creation form      |
| /login             | Guest only  | `<Login />`      | Login form                     |
| /listings/:id      | Public      | `<ListingDetail />` | Single listing detail view  |
| /create            | Auth required | `<CreateListing />` | New listing form           |
| /listings/:id/edit | Owner only  | `<EditListing />` | Edit existing listing         |
| /profile           | Auth required | `<Profile />`  | User's own listings + saved   |
| *                  | Public      | `<NotFound />`   | 404 fallback page             |
