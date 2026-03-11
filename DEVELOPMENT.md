# TravS — Phase-Wise Development Guide

> Version 1.0 | March 2026 | Stack: React + Vite · Django REST · MySQL

---

## Brand Color Palette

| Swatch | Hex | Role | Usage |
|--------|-----|------|-------|
| ![#0D1A63](https://placehold.co/28x28/0D1A63/0D1A63.png) | `#0D1A63` | Deep Navy | Page backgrounds, footer, primary text |
| ![#1A2CA3](https://placehold.co/28x28/1A2CA3/1A2CA3.png) | `#1A2CA3` | Royal Blue | Navbar, section headers, links |
| ![#2845D6](https://placehold.co/28x28/2845D6/2845D6.png) | `#2845D6` | Cobalt Blue | Buttons, active states, focus rings |
| ![#F68048](https://placehold.co/28x28/F68048/F68048.png) | `#F68048` | Coral Orange | CTAs, like/save icons, highlights, badges |

### Tailwind CSS Config

Add the following to `tailwind.config.js` to register the palette as custom colors:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy:   '#0D1A63',
          royal:  '#1A2CA3',
          cobalt: '#2845D6',
          coral:  '#F68048',
        },
      },
    },
  },
  plugins: [],
};
```

**Usage in components:**

```jsx
// Primary button (Cobalt Blue → Coral Orange on hover)
<button className="bg-brand-cobalt hover:bg-brand-coral text-white px-6 py-2 rounded-lg transition-colors">
  Create Experience
</button>

// Navbar background
<nav className="bg-brand-navy text-white">

// Section heading
<h2 className="text-brand-royal font-bold text-2xl">

// Like / Save icon accent
<HeartIcon className="text-brand-coral" />
```

---

## Build Timeline Overview

| Phase | Hours    | Focus                  |
|-------|----------|------------------------|
| 1     | 0 – 2 h  | Project Setup          |
| 2     | 2 – 5 h  | Auth — Backend         |
| 3     | 5 – 7 h  | Auth — Frontend        |
| 4     | 7 – 11 h | Listings CRUD          |
| 5     | 11 – 14 h| Optional Features      |
| 6     | 14 – 17 h| UI Polish              |
| 7     | 17 – 20 h| Deployment             |
| 8     | 20 – 22 h| README                 |
| 9     | 22 – 24 h| Buffer & Submission    |

---

## Table of Contents

- [Phase 1 — Project Setup](#phase-1--project-setup-0--2-h)
- [Phase 2 — Auth Backend](#phase-2--auth-backend-2--5-h)
- [Phase 3 — Auth Frontend](#phase-3--auth-frontend-5--7-h)
- [Phase 4 — Listings CRUD](#phase-4--listings-crud-7--11-h)
- [Phase 5 — Optional Features](#phase-5--optional-features-11--14-h)
- [Phase 6 — UI Polish](#phase-6--ui-polish-14--17-h)
- [Phase 7 — Deployment](#phase-7--deployment-17--20-h)
- [Phase 8 — README](#phase-8--readme-20--22-h)
- [Phase 9 — Buffer & Submission](#phase-9--buffer--submission-22--24-h)
- [Evaluation Criteria](#evaluation-criteria)


---

## Phase 1 — Project Setup (0 – 2 h)

### Goals
- Initialise Django project and React + Vite app
- Configure MySQL database connection
- Set up CORS
- Establish the full directory structure
- First `git commit`

---

### 1.1 Project Structure

```
TravS/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axiosInstance.js       # Base Axios config + JWT interceptor
│   │   │   ├── authApi.js             # register, login, logout, me
│   │   │   └── listingsApi.js         # CRUD + like + save calls
│   │   ├── components/
│   │   │   ├── ListingCard.jsx        # Feed card component
│   │   │   ├── Navbar.jsx             # Top navigation bar
│   │   │   ├── SearchBar.jsx          # Debounced search input
│   │   │   └── ProtectedRoute.jsx     # Auth guard wrapper
│   │   ├── pages/
│   │   │   ├── Feed.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ListingDetail.jsx
│   │   │   ├── CreateListing.jsx
│   │   │   ├── EditListing.jsx
│   │   │   └── Profile.jsx
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   └── listingStore.js
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── utils/
│   │   │   └── timeAgo.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── vite.config.js
│
└── backend/
    ├── config/
    │   ├── settings/
    │   │   ├── base.py
    │   │   ├── development.py
    │   │   └── production.py
    │   ├── urls.py
    │   └── wsgi.py
    ├── apps/
    │   ├── accounts/
    │   │   ├── models.py
    │   │   ├── serializers.py
    │   │   ├── views.py
    │   │   └── urls.py
    │   └── listings/
    │       ├── models.py
    │       ├── serializers.py
    │       ├── views.py
    │       ├── permissions.py
    │       ├── filters.py
    │       └── urls.py
    ├── requirements.txt
    ├── manage.py
    └── .env.example
```

---

### 1.2 Prerequisites

| Tool    | Version |
|---------|---------|
| Node.js | 18+     |
| Python  | 3.11+   |
| MySQL   | 8.x     |
| pip     | latest  |

---

### 1.3 Backend Initialisation

```bash
# Create Django project
django-admin startproject config .
python manage.py startapp accounts
python manage.py startapp listings

# Move apps into apps/ directory, update config/settings/base.py accordingly

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

pip install -r requirements.txt
```

**`requirements.txt`**

```
Django>=4.2,<5.0
djangorestframework>=3.15
djangorestframework-simplejwt>=5.3
django-cors-headers>=4.3
django-filter>=23.5
mysqlclient>=2.2
python-decouple>=3.8
gunicorn>=21.2
```

**`.env.example` (backend)**

```env
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=travs_db
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=3306
CORS_ALLOWED_ORIGINS=http://localhost:5173
ACCESS_TOKEN_LIFETIME_MINUTES=15
REFRESH_TOKEN_LIFETIME_DAYS=7
```

---

### 1.4 Frontend Initialisation

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install axios react-router-dom zustand
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**`.env.example` (frontend)**

```env
VITE_API_URL=http://localhost:8000/api
```

---

### 1.5 Django Base Settings

**`config/settings/base.py`** — critical sections:

```python
from decouple import config
from datetime import timedelta

AUTH_USER_MODEL = 'accounts.User'

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'django_filters',
    # Local
    'apps.accounts',
    'apps.listings',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    # ...rest of default middleware
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME':     config('DB_NAME'),
        'USER':     config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST':     config('DB_HOST', default='localhost'),
        'PORT':     config('DB_PORT', default='3306'),
    }
}

CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='').split(',')
```

---

### 1.6 Root URL Config

**`config/urls.py`**

```python
from django.urls import path, include

urlpatterns = [
    path('api/auth/',     include('apps.accounts.urls')),
    path('api/listings/', include('apps.listings.urls')),
]
```

---

### Phase 1 Checklist

- [ ] Django project initialised, apps created
- [ ] React + Vite app initialised with Tailwind, Axios, React Router, Zustand
- [ ] MySQL database created (`travs_db`)
- [ ] `.env` files configured (both backend and frontend)
- [ ] `python manage.py migrate` runs without errors
- [ ] `npm run dev` starts on `localhost:5173`
- [ ] `git init` + first meaningful commit pushed

---

## Phase 2 — Auth Backend (2 – 5 h)

### Goals
- Custom User model (email as login field)
- Register, Login, Logout, Token Refresh, and Me endpoints
- SimpleJWT configuration
- Test all endpoints with Postman

---

### 2.1 Custom User Model

**`apps/accounts/models.py`**

```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
```

> Set `AUTH_USER_MODEL = 'accounts.User'` in `base.py` **before** the first migration.

---

### 2.2 Serializers

**`apps/accounts/serializers.py`**

```python
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ('username', 'email', 'password', 'password2')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError('Passwords do not match.')
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        return User.objects.create_user(**validated_data)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ('id', 'username', 'email', 'date_joined')
```

---

### 2.3 Views

**`apps/accounts/views.py`**

```python
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            token = RefreshToken(request.data.get('refresh'))
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
```

---

### 2.4 URL Routing

**`apps/accounts/urls.py`**

```python
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, MeView, LogoutView

urlpatterns = [
    path('register/',      RegisterView.as_view()),
    path('login/',         TokenObtainPairView.as_view()),
    path('logout/',        LogoutView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('me/',            MeView.as_view()),
]
```

---

### 2.5 SimpleJWT Settings

Add to **`config/settings/base.py`**:

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME':  timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS':  True,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

---

### 2.6 Auth Endpoints Reference

| Method | Endpoint             | Auth     | Response                  |
|--------|----------------------|----------|---------------------------|
| POST   | /api/auth/register/  | Public   | 201 — user object         |
| POST   | /api/auth/login/     | Public   | 200 — access + refresh    |
| POST   | /api/auth/logout/    | Required | 205 — no content          |
| POST   | /api/auth/token/refresh/ | Public | 200 — new access token  |
| GET    | /api/auth/me/        | Required | 200 — user profile        |

---

### Phase 2 Checklist

- [ ] Custom `User` model created with `email` as `USERNAME_FIELD`
- [ ] First migration created and applied (`makemigrations accounts`, `migrate`)
- [ ] `POST /api/auth/register/` returns 201 with user object
- [ ] `POST /api/auth/login/` returns access + refresh tokens
- [ ] `GET /api/auth/me/` returns authenticated user profile
- [ ] `POST /api/auth/logout/` blacklists refresh token (205)
- [ ] `POST /api/auth/token/refresh/` returns new access token
- [ ] All endpoints tested in Postman

---

## Phase 3 — Auth Frontend (5 – 7 h)

### Goals
- Axios instance with JWT request interceptor and 401 refresh interceptor
- Zustand auth store
- Register and Login page forms with validation
- `ProtectedRoute` component
- Persistent auth state on page refresh

---

### 3.1 Axios Instance with JWT Interceptor

**`src/api/axiosInstance.js`**

```javascript
import axios from 'axios';
import useAuthStore from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,   // sends httpOnly refresh cookie
});

// Attach access token from memory on every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, silently refresh and retry the original request
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
          {},
          { withCredentials: true }
        );
        useAuthStore.getState().setAccessToken(data.access);
        error.config.headers.Authorization = `Bearer ${data.access}`;
        return api(error.config);
      } catch {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### 3.2 Auth API Calls

**`src/api/authApi.js`**

```javascript
import api from './axiosInstance';

export const register = (data)  => api.post('/auth/register/', data);
export const login    = (data)  => api.post('/auth/login/', data);
export const logout   = (data)  => api.post('/auth/logout/', data);
export const getMe    = ()      => api.get('/auth/me/');
```

---

### 3.3 Auth Store (Zustand)

**`src/store/authStore.js`**

```javascript
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user:         null,
  accessToken:  null,
  setAccessToken: (token) => set({ accessToken: token }),
  setUser:        (user)  => set({ user }),
  logout:         ()      => set({ user: null, accessToken: null }),
}));

export default useAuthStore;
```

---

### 3.4 Auth Initialisation on App Load

**`src/hooks/useAuth.js`**

```javascript
import { useEffect } from 'react';
import { getMe } from '../api/authApi';
import useAuthStore from '../store/authStore';

export function useAuthInit() {
  const { setUser } = useAuthStore();
  useEffect(() => {
    getMe()
      .then(({ data }) => setUser(data))
      .catch(() => {});  // refresh token missing or expired — stay logged out
  }, []);
}
```

Call `useAuthInit()` inside `App.jsx` once on mount.

---

### 3.5 Protected Route

**`src/components/ProtectedRoute.jsx`**

```jsx
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function ProtectedRoute({ children }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
```

---

### 3.6 React Router Setup

**`src/App.jsx`**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthInit } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Feed           from './pages/Feed';
import Login          from './pages/Login';
import Register       from './pages/Register';
import ListingDetail  from './pages/ListingDetail';
import CreateListing  from './pages/CreateListing';
import EditListing    from './pages/EditListing';
import Profile        from './pages/Profile';
import NotFound       from './pages/NotFound';

export default function App() {
  useAuthInit();  // attempt silent re-auth on every page load
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                  element={<Feed />} />
        <Route path="/login"             element={<Login />} />
        <Route path="/register"          element={<Register />} />
        <Route path="/listings/:id"      element={<ListingDetail />} />
        <Route path="/create"            element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
        <Route path="/listings/:id/edit" element={<ProtectedRoute><EditListing /></ProtectedRoute>} />
        <Route path="/profile"           element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*"                  element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

### 3.7 Authentication Flow

```
1. User submits email + password on /login
        │
        ▼
2. POST /api/auth/login/
        │
        ▼
3. Django verifies → SimpleJWT generates:
   - access token  (15 min)  → JSON body
   - refresh token (7 days)  → httpOnly cookie
        │
        ▼
4. Frontend stores access token in Zustand (memory only)
        │
        ▼
5. Axios interceptor attaches: Authorization: Bearer <access>
        │
        ▼
6. On 401 → POST /api/auth/token/refresh/ (cookie auto-sent)
          → new access token stored, original request retried
        │
        ▼
7. Logout → POST /api/auth/logout/ → refresh blacklisted
          → Zustand cleared → redirect to /login
```

**Security rules:**
- Access token: Zustand memory only — never `localStorage`, never a cookie
- Refresh token: `httpOnly` cookie — inaccessible to JavaScript
- CORS restricted to the known Vercel domain in production

---

### Phase 3 Checklist

- [ ] Axios instance created with base URL from `.env`
- [ ] Request interceptor attaches `Authorization: Bearer` header
- [ ] Response interceptor silently refreshes on 401 and retries
- [ ] `useAuthStore` stores `user` and `accessToken` in memory
- [ ] `useAuthInit()` restores session on page refresh via `GET /auth/me/`
- [ ] `/register` form: username, email, password, confirm password + validation
- [ ] `/login` form: email + password; redirects to `/` on success
- [ ] `ProtectedRoute` redirects unauthenticated users to `/login`
- [ ] Logout clears Zustand and redirects to `/login`

---

## Phase 4 — Listings CRUD (7 – 11 h)

### Goals
- Django Listing model with migrations and indexes
- `IsOwnerOrReadOnly` permission
- DRF `ListingViewSet` with search filter and pagination
- React pages: Feed, CreateListing, ListingDetail

---

### 4.1 Database Schema

#### Users Table

| Column     | Type         | Constraint         | Description           |
|------------|--------------|--------------------|-----------------------|
| id         | INT          | PK, AUTO_INCREMENT | Primary key           |
| username   | VARCHAR(150) | UNIQUE, NOT NULL   | Unique display name   |
| email      | VARCHAR(254) | UNIQUE, NOT NULL   | Login identifier      |
| password   | VARCHAR(128) | NOT NULL           | Hashed via PBKDF2     |
| created_at | DATETIME     | NOT NULL           | Account creation time |
| updated_at | DATETIME     | NOT NULL           | Last profile update   |

#### Listings Table

| Column      | Type          | Constraint           | Description                 |
|-------------|---------------|----------------------|-----------------------------|
| id          | INT           | PK, AUTO_INCREMENT   | Primary key                 |
| user_id     | INT           | FK → users.id        | Creator (CASCADE DELETE)    |
| title       | VARCHAR(200)  | NOT NULL             | Experience title            |
| location    | VARCHAR(200)  | NOT NULL             | City / region               |
| image_url   | VARCHAR(500)  | NOT NULL             | Public image URL            |
| description | TEXT          | NOT NULL             | Full experience description |
| price       | DECIMAL(10,2) | NULL                 | Optional price in USD       |
| likes_count | INT           | DEFAULT 0            | Denormalised like counter   |
| created_at  | DATETIME      | NOT NULL, INDEX      | Post time (feed ordering)   |
| updated_at  | DATETIME      | NOT NULL             | Last edit timestamp         |

#### Index Strategy

```sql
-- Feed ordering index
ALTER TABLE listings ADD INDEX idx_feed (created_at DESC, id);

-- Full-text search index
ALTER TABLE listings ADD FULLTEXT INDEX idx_search (title, location, description);
```

---

### 4.2 Django Models

**`apps/listings/models.py`**

```python
from django.db import models
from django.conf import settings

class Listing(models.Model):
    user        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='listings')
    title       = models.CharField(max_length=200)
    location    = models.CharField(max_length=200)
    image_url   = models.URLField(max_length=500)
    description = models.TextField()
    price       = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    likes_count = models.PositiveIntegerField(default=0)
    created_at  = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
```

---

### 4.3 Serializer

**`apps/listings/serializers.py`**

```python
from rest_framework import serializers
from .models import Listing
from apps.accounts.serializers import UserSerializer

class ListingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model  = Listing
        fields = ('id', 'user', 'title', 'location', 'image_url',
                  'description', 'price', 'likes_count', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'likes_count', 'created_at', 'updated_at')
```

---

### 4.4 Custom Permission

**`apps/listings/permissions.py`**

```python
from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.user == request.user
```

---

### 4.5 Search Filter

**`apps/listings/filters.py`**

```python
import django_filters
from django.db import models as django_models
from .models import Listing

class ListingFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='filter_search')

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            django_models.Q(title__icontains=value) |
            django_models.Q(location__icontains=value) |
            django_models.Q(description__icontains=value)
        )

    class Meta:
        model  = Listing
        fields = ['search']
```

---

### 4.6 Listing ViewSet

**`apps/listings/views.py`**

```python
from rest_framework import viewsets, permissions
from .models import Listing
from .serializers import ListingSerializer
from .permissions import IsOwnerOrReadOnly
from .filters import ListingFilter

class ListingViewSet(viewsets.ModelViewSet):
    queryset           = Listing.objects.select_related('user').all()
    serializer_class   = ListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filterset_class    = ListingFilter

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
```

---

### 4.7 Listings URL Routing

**`apps/listings/urls.py`**

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ListingViewSet

router = DefaultRouter()
router.register(r'', ListingViewSet, basename='listing')

urlpatterns = router.urls
```

---

### 4.8 DRF Pagination + Filter Settings

Add to **`config/settings/base.py`**:

```python
REST_FRAMEWORK = {
    ...
    'DEFAULT_FILTER_BACKENDS':  ('django_filters.rest_framework.DjangoFilterBackend',),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 12,
}
```

---

### 4.9 Listings API Reference

| Method | Endpoint          | Auth       | Description                                  |
|--------|-------------------|------------|----------------------------------------------|
| GET    | /api/listings/    | Public     | All listings, newest first. `?search=` `?page=` |
| POST   | /api/listings/    | Required   | Create listing                               |
| GET    | /api/listings/{id}/ | Public   | Single listing detail                        |
| PUT    | /api/listings/{id}/ | Owner only | Full update                                |
| PATCH  | /api/listings/{id}/ | Owner only | Partial update                             |
| DELETE | /api/listings/{id}/ | Owner only | Delete listing                             |

#### Sample — Create Listing

```json
// POST /api/listings/
// Request Body
{
  "title": "Sunset Boat Tour",
  "location": "Bali, Indonesia",
  "image_url": "https://example.com/sunset-boat.jpg",
  "description": "Enjoy a beautiful sunset while sailing along the Bali coastline. Includes drinks and snacks.",
  "price": 45.00
}

// Response 201 Created
{
  "id": 12,
  "title": "Sunset Boat Tour",
  "location": "Bali, Indonesia",
  "image_url": "https://example.com/sunset-boat.jpg",
  "description": "Enjoy a beautiful sunset while sailing along the Bali coastline.",
  "price": "45.00",
  "likes_count": 0,
  "created_at": "2026-03-11T10:30:00Z",
  "user": { "id": 3, "username": "john_travels" }
}
```

---

### 4.10 Frontend — Listings API Calls

**`src/api/listingsApi.js`**

```javascript
import api from './axiosInstance';

export const getListings   = (params) => api.get('/listings/', { params });
export const getListing    = (id)     => api.get(`/listings/${id}/`);
export const createListing = (data)   => api.post('/listings/', data);
export const updateListing = (id, data) => api.put(`/listings/${id}/`, data);
export const deleteListing = (id)     => api.delete(`/listings/${id}/`);
```

---

### 4.11 Frontend — timeAgo Utility

**`src/utils/timeAgo.js`**

```javascript
export function timeAgo(dateString) {
  const diff  = Date.now() - new Date(dateString).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days  > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
}
```

---

### 4.12 Listing Card Shape

Each card in the feed displays:
- Listing image (lazy-loaded via `loading="lazy"`)
- Title
- Location
- Description truncated to 120 characters
- Creator username
- Relative timestamp via `timeAgo()`
- Like / Save icons (authenticated users only)

---

### Phase 4 Checklist

- [ ] `Listing` model created, migration applied
- [ ] `IsOwnerOrReadOnly` permission in place
- [ ] `ListingFilter` supports `?search=` on title, location, description
- [ ] `ListingViewSet` with `select_related('user')` for N+1 prevention
- [ ] `GET /api/listings/` returns 12 listings per page, newest first
- [ ] `POST /api/listings/` creates listing for authenticated user (201)
- [ ] `GET /api/listings/{id}/` returns full listing detail
- [ ] `PUT/PATCH /api/listings/{id}/` restricted to owner (403 for non-owners)
- [ ] `DELETE /api/listings/{id}/` restricted to owner
- [ ] React `/` (Feed) page renders listing cards from API
- [ ] React `/create` form posts to API and redirects to feed
- [ ] React `/listings/:id` page renders full listing detail

---

## Phase 5 — Optional Features (11 – 14 h)

### Goals
- Edit and Delete listings (owner-only)
- Search with debounce
- Like and Save / Bookmark toggles

---

### 5.1 Saved Listings Table

| Column     | Type     | Constraint         | Description    |
|------------|----------|--------------------|----------------|
| id         | INT      | PK, AUTO_INCREMENT | Primary key    |
| user_id    | INT      | FK → users.id      | User who saved |
| listing_id | INT      | FK → listings.id   | Saved listing  |
| created_at | DATETIME | NOT NULL           | When saved     |

```python
# apps/listings/models.py (add below Listing)
class SavedListing(models.Model):
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    listing    = models.ForeignKey(Listing, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'listing')
```

---

### 5.2 Like & Save Backend Views

**`apps/listings/views.py`** — add to existing file:

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db import transaction
from .models import Listing, SavedListing

class LikeListingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        listing = Listing.objects.get(pk=pk)
        # Simple toggle via a ManyToMany or annotation — here using a naive counter
        # Replace with a proper Like model for production
        listing.likes_count += 1
        listing.save(update_fields=['likes_count'])
        return Response({'likes_count': listing.likes_count})

class SaveListingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        listing = Listing.objects.get(pk=pk)
        obj, created = SavedListing.objects.get_or_create(user=request.user, listing=listing)
        if not created:
            obj.delete()
            return Response({'saved': False})
        return Response({'saved': True}, status=status.HTTP_201_CREATED)

class SavedListingsView(generics.ListAPIView):
    serializer_class   = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Listing.objects.filter(
            savedlisting__user=self.request.user
        ).select_related('user')
```

---

### 5.3 Like & Save URL Routing

Update **`apps/listings/urls.py`**:

```python
from .views import ListingViewSet, LikeListingView, SaveListingView, SavedListingsView

urlpatterns = [
    path('saved/',             SavedListingsView.as_view()),
    path('<int:pk>/like/',     LikeListingView.as_view()),
    path('<int:pk>/save/',     SaveListingView.as_view()),
] + router.urls
```

---

### 5.4 Additional API Endpoints

| Method | Endpoint                 | Auth     | Description                     |
|--------|--------------------------|----------|---------------------------------|
| POST   | /api/listings/{id}/like/ | Required | Toggle like on a listing        |
| POST   | /api/listings/{id}/save/ | Required | Toggle save / bookmark          |
| GET    | /api/listings/saved/     | Required | Current user's saved listings   |

---

### 5.5 Frontend — Search Debounce

**`src/components/SearchBar.jsx`**

```jsx
import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => onSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <input
      type="text"
      placeholder="Search experiences..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
```

In **`Feed.jsx`**, wire `onSearch` to call `getListings({ search: query })`.

---

### 5.6 Frontend — Edit Listing Page

**`/listings/:id/edit`** — only renders when `listing.user.id === currentUser.id`.

Key behaviour:
- Pre-populate form fields from `GET /api/listings/{id}/`
- On submit call `PUT /api/listings/{id}/` and redirect to `/listings/:id`
- Show 403 error if user navigates directly without owning the listing

---

### 5.7 Frontend — Delete Listing

Add a **Delete** button on `ListingDetail.jsx` visible only to the owner:

```jsx
const handleDelete = async () => {
  if (!window.confirm('Delete this listing?')) return;
  await deleteListing(id);
  navigate('/');
};
```

---

### Phase 5 Checklist

- [ ] `SavedListing` model created, migration applied
- [ ] `POST /api/listings/{id}/like/` toggles `likes_count`
- [ ] `POST /api/listings/{id}/save/` creates/deletes `SavedListing` (idempotent)
- [ ] `GET /api/listings/saved/` returns current user's saved listings
- [ ] `PUT /api/listings/{id}/` edit works for owner; 403 for others
- [ ] `DELETE /api/listings/{id}/` delete works for owner with confirmation
- [ ] Search bar debounces 300ms and fires `?search=` query
- [ ] Edit page pre-populates form from existing listing data
- [ ] Like / Save icons visible on feed cards (authenticated users only)

---

## Phase 6 — UI Polish (14 – 17 h)

### Goals
- Responsive layout at 375px, 768px, 1280px
- Loading skeletons / spinners
- Error messages and empty states
- Navbar with conditional auth links
- Breadcrumb on listing detail

---

### 6.1 Tailwind Breakpoint Strategy

| Breakpoint | Width  | Layout                         |
|------------|--------|--------------------------------|
| `sm`       | 375px  | Single column, stacked cards   |
| `md`       | 768px  | 2-column card grid             |
| `lg`       | 1280px | 3-column card grid, wide navbar|

Tailwind grid example for the feed:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
</div>
```

---

### 6.2 Loading State

```jsx
if (loading) return (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500" />
  </div>
);
```

---

### 6.3 Empty State

```jsx
if (!listings.length) return (
  <div className="text-center py-20 text-gray-400">
    <p className="text-xl font-semibold">No experiences found</p>
    <p className="mt-2 text-sm">Try a different search or be the first to post one.</p>
  </div>
);
```

---

### 6.4 Error Handling

- Display inline field errors from DRF serializer responses
- Show a toast / banner for network errors
- 404 page rendered via the `*` route → `<NotFound />`

---

### 6.5 Navbar — Conditional Links

```jsx
// Logged out: Show Login + Register
// Logged in:  Show Profile + Create Listing + Logout
const { user, logout } = useAuthStore();
```

---

### 6.6 Listing Detail — Breadcrumb

```jsx
<nav className="text-sm text-gray-500 mb-4">
  <Link to="/" className="hover:underline">Feed</Link>
  <span className="mx-2">›</span>
  <span className="text-gray-800">{listing.title}</span>
</nav>
```

---

### Phase 6 Checklist

- [ ] Feed renders in 1 / 2 / 3 column grid at sm / md / lg breakpoints
- [ ] Loading spinner shown while API calls are in flight
- [ ] Empty state shown when search returns no results
- [ ] DRF validation errors displayed on form fields
- [ ] Navbar shows correct links based on auth state
- [ ] Listing detail breadcrumb navigates back to feed
- [ ] Price displays as "Free" when `null`
- [ ] Images use `loading="lazy"` and `object-cover` with fixed height

---

## Phase 7 — Deployment (17 – 20 h)

### Goals
- Deploy backend to Render
- Deploy frontend to Vercel
- Connect managed MySQL (PlanetScale / Railway)
- Confirm live environment end-to-end

---

### 7.1 Frontend → Vercel

```bash
cd frontend
npm run build

# Via Vercel CLI
vercel deploy --prod
```

Vercel environment variables:

```
VITE_API_URL = https://your-backend.onrender.com/api
```

---

### 7.2 Backend → Render

1. Create a new **Web Service** on Render, connect the GitHub repo
2. **Root Directory**: `backend`
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`

Render environment variables:

```
SECRET_KEY               = <generated secret>
DEBUG                    = False
ALLOWED_HOSTS            = your-backend.onrender.com
DB_NAME                  = travs_db
DB_USER                  = <db user>
DB_PASSWORD              = <db password>
DB_HOST                  = <planetscale or railway host>
DB_PORT                  = 3306
CORS_ALLOWED_ORIGINS     = https://your-frontend.vercel.app
```

After first deploy, run migrations via the Render Shell:

```bash
python manage.py migrate
```

---

### 7.3 Database → PlanetScale / Railway

- Create a MySQL database instance on PlanetScale or Railway
- Copy the host, user, password, and database name into Render env vars
- PlanetScale requires `ssl_ca` config — add `OPTIONS: {'ssl': {'ca': '/etc/ssl/certs/ca-certificates.crt'}}` to `DATABASES`

---

### Phase 7 Checklist

- [ ] Frontend deployed to Vercel, accessible at `https://*.vercel.app`
- [ ] Backend deployed to Render, accessible at `https://*.onrender.com`
- [ ] Managed MySQL provisioned and migrations applied
- [ ] `CORS_ALLOWED_ORIGINS` set to the exact Vercel domain
- [ ] `DEBUG=False` and `SECRET_KEY` set in Render env vars
- [ ] End-to-end smoke test: register → login → create listing → view feed → logout

---

## Phase 8 — README (20 – 22 h)

### Goals
- Write the final submission README covering all required sections

### Required Sections

1. **Project Overview** — what the platform does, one paragraph
2. **Tech Stack** — table with layer / technology / rationale
3. **Setup Instructions** — backend and frontend step-by-step
4. **Features Implemented** — required + optional checklists
5. **Architecture & Key Decisions** — why this stack, auth approach, data model
6. **Scaling to 10,000 Listings** — paste the answer below

### Scaling Answer (paste into README)

> With 10,000 listings, I would: (1) Add DB indexes on `created_at` and a FULLTEXT index on searchable fields. (2) Switch from OFFSET pagination to cursor-based keyset pagination. (3) Cache the public feed in Redis with a short TTL. (4) Use Django `select_related` to eliminate N+1 queries. (5) Add virtual scrolling and image lazy-loading on the frontend. Together these changes keep feed load time under 200ms even at scale.

### Scaling Detail

#### Database

| Change | Reason |
|--------|--------|
| Composite index on `(created_at DESC, id)` | Eliminates full table scan on feed queries |
| FULLTEXT index on `(title, location, description)` | Replaces slow `LIKE '%query%'` O(n) scans |
| Cursor-based (keyset) pagination | `OFFSET` degrades at high page numbers — keyset stays O(1) |

#### Backend

| Change | Reason |
|--------|--------|
| Redis cache on `GET /listings/` (TTL: 60s) | Feed is read-heavy; caching removes 90%+ of DB hits |
| `select_related('user')` on listing queryset | Prevents N+1 queries when serialising creator data |
| Rate limit creation (10/hour per IP) | Prevents spam; use `django-ratelimit` |

#### Frontend

| Change | Reason |
|--------|--------|
| Virtual scrolling (`react-virtual`) | Only renders visible DOM nodes, not all 10k cards |
| `loading="lazy"` on images + WebP via CDN | Defers off-screen loads; smaller file sizes |
| Search debounce (300ms) | Prevents an API call on every keystroke |

---

### Phase 8 Checklist

- [ ] README contains all 6 required sections
- [ ] Scaling answer is included verbatim or paraphrased
- [ ] Live demo URLs (Vercel + Render) added to README
- [ ] Setup instructions tested on a clean environment

---

## Phase 9 — Buffer & Submission (22 – 24 h)

### Goals
- Bug fixes and final testing
- Clean up commits
- Submit

---

### 9.1 Pre-Submission Testing

| Area         | Test                                                        |
|--------------|-------------------------------------------------------------|
| Auth         | Register → Login → Refresh → Logout cycle works fully      |
| Feed         | Loads paginated listings; search filters correctly          |
| Create       | Form validates and posts; new listing appears in feed       |
| Detail       | Full image, description, price ("Free" if null)            |
| Edit         | Owner edits listing; non-owner receives 403                 |
| Delete       | Owner deletes with confirmation; non-owner button hidden    |
| Like / Save  | Toggle works; count updates without page reload             |
| Responsive   | Layout correct at 375px, 768px, 1280px                     |

---

### 9.2 Git Hygiene

```bash
# Ensure meaningful commit history (not a single dump commit)
git log --oneline

# Suggested commit structure:
# feat: init Django project and React Vite app
# feat: add custom User model and JWT auth endpoints
# feat: add Axios interceptor and frontend auth flow
# feat: add Listing model and DRF CRUD viewset
# feat: add like/save endpoints and frontend UI
# style: responsive Tailwind layout and loading states
# chore: configure deployment env vars and run migrations
# docs: finalise README with scaling answer
```

---

### 9.3 Submission Checklist

- [ ] GitHub repo has multiple meaningful commits (no single dump)
- [ ] Live demo URL — Vercel frontend accessible
- [ ] Live demo URL — Render backend accessible
- [ ] README includes: Overview, Tech Stack, Setup, Features, Architecture, Scaling Answer
- [ ] Reply email contains: GitHub link + live demo link + short implementation note

---

## Evaluation Criteria

| Category           | Points   | What's Expected                                              |
|--------------------|----------|--------------------------------------------------------------|
| Functionality      | 30 pts   | Auth works, CRUD works, feed + detail renders correctly     |
| Code Quality       | 20 pts   | Clean structure, no dead code, meaningful names, DRY        |
| UI / UX            | 15 pts   | Responsive, polished, intuitive — looks like a real product |
| Database Structure | 15 pts   | Proper schema, correct FK relationships, indexes            |
| Documentation      | 10 pts   | README complete with all required sections + scaling answer |
| Optional Features  | 10 pts   | Search, like/save, edit, delete, pagination                 |
| **TOTAL**          | **100 pts** |                                                          |

---

*TravS — Development Guide v1.0 | Internal Use Only*


```
TravS/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axiosInstance.js       # Base Axios config + JWT interceptor
│   │   │   ├── authApi.js             # register, login, logout, me
│   │   │   └── listingsApi.js         # CRUD + like + save calls
│   │   ├── components/
│   │   │   ├── ListingCard.jsx        # Feed card component
│   │   │   ├── Navbar.jsx             # Top navigation bar
│   │   │   ├── SearchBar.jsx          # Debounced search input
│   │   │   └── ProtectedRoute.jsx     # Auth guard wrapper
│   │   ├── pages/
│   │   │   ├── Feed.jsx               # / or /feed
│   │   │   ├── Login.jsx              # /login
│   │   │   ├── Register.jsx           # /register
│   │   │   ├── ListingDetail.jsx      # /listings/:id
│   │   │   ├── CreateListing.jsx      # /create
│   │   │   ├── EditListing.jsx        # /listings/:id/edit
│   │   │   └── Profile.jsx            # /profile
│   │   ├── store/
│   │   │   ├── authStore.js           # Zustand auth state
│   │   │   └── listingStore.js        # Zustand listings state
│   │   ├── hooks/
│   │   │   └── useAuth.js             # Auth helper hook
│   │   ├── utils/
│   │   │   └── timeAgo.js             # Relative timestamp formatter
│   │   ├── App.jsx                    # React Router setup
│   │   └── main.jsx                   # Vite entry point
│   ├── .env.example
│   └── vite.config.js
│
└── backend/
    ├── config/
    │   ├── settings/
    │   │   ├── base.py                # Shared settings
    │   │   ├── development.py         # Dev overrides (DEBUG=True)
    │   │   └── production.py          # Prod overrides (DEBUG=False)
    │   ├── urls.py                    # Root URL config
    │   └── wsgi.py
    ├── apps/
    │   ├── accounts/
    │   │   ├── models.py              # Custom User model
    │   │   ├── serializers.py         # Register + User serializers
    │   │   ├── views.py               # Register, login, logout, me
    │   │   └── urls.py
    │   └── listings/
    │       ├── models.py              # Listing + SavedListing models
    │       ├── serializers.py         # Listing serializer
    │       ├── views.py               # ListingViewSet + like/save actions
    │       ├── permissions.py         # IsOwnerOrReadOnly
    │       ├── filters.py             # Search filterset
    │       └── urls.py
    ├── requirements.txt
    ├── manage.py
    └── .env.example
```

---

## 2. Environment Setup

### Prerequisites

| Tool      | Version  |
|-----------|----------|
| Node.js   | 18+      |
| Python    | 3.11+    |
| MySQL     | 8.x      |
| pip       | latest   |

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env — fill in SECRET_KEY, DB_NAME, DB_USER, DB_PASSWORD, DB_HOST

# Apply migrations
python manage.py migrate

# (Optional) Create superuser for Django admin
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

**`.env.example` (backend)**

```env
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=travs_db
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=3306
CORS_ALLOWED_ORIGINS=http://localhost:5173
ACCESS_TOKEN_LIFETIME_MINUTES=15
REFRESH_TOKEN_LIFETIME_DAYS=7
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env — set VITE_API_URL

# Start development server
npm run dev
```

**`.env.example` (frontend)**

```env
VITE_API_URL=http://localhost:8000/api
```

### Backend `requirements.txt`

```
Django>=4.2,<5.0
djangorestframework>=3.15
djangorestframework-simplejwt>=5.3
django-cors-headers>=4.3
django-filter>=23.5
mysqlclient>=2.2
python-decouple>=3.8
gunicorn>=21.2
```

---

## 3. Database Schema

### 3.1 Users Table

| Column       | Type          | Constraint            | Description               |
|--------------|---------------|-----------------------|---------------------------|
| id           | INT           | PK, AUTO_INCREMENT    | Primary key               |
| username     | VARCHAR(150)  | UNIQUE, NOT NULL      | Unique display name       |
| email        | VARCHAR(254)  | UNIQUE, NOT NULL      | Login identifier          |
| password     | VARCHAR(128)  | NOT NULL              | Hashed via PBKDF2         |
| created_at   | DATETIME      | NOT NULL              | Account creation time     |
| updated_at   | DATETIME      | NOT NULL              | Last profile update       |

### 3.2 Listings Table

| Column       | Type            | Constraint            | Description                    |
|--------------|-----------------|-----------------------|--------------------------------|
| id           | INT             | PK, AUTO_INCREMENT    | Primary key                    |
| user_id      | INT             | FK → users.id         | Creator (CASCADE DELETE)       |
| title        | VARCHAR(200)    | NOT NULL              | Experience title               |
| location     | VARCHAR(200)    | NOT NULL              | City / region                  |
| image_url    | VARCHAR(500)    | NOT NULL              | Public image URL               |
| description  | TEXT            | NOT NULL              | Full experience description    |
| price        | DECIMAL(10,2)   | NULL                  | Optional price in USD          |
| likes_count  | INT             | DEFAULT 0             | Denormalised like counter      |
| created_at   | DATETIME        | NOT NULL, INDEX       | Post time (feed ordering)      |
| updated_at   | DATETIME        | NOT NULL              | Last edit timestamp            |

### 3.3 Saved Listings Table

| Column       | Type  | Constraint            | Description          |
|--------------|-------|-----------------------|----------------------|
| id           | INT   | PK, AUTO_INCREMENT    | Primary key          |
| user_id      | INT   | FK → users.id         | User who saved       |
| listing_id   | INT   | FK → listings.id      | Saved listing        |
| created_at   | DATETIME | NOT NULL           | When saved           |

### 3.4 Index Strategy

```sql
-- Feed ordering index
ALTER TABLE listings ADD INDEX idx_feed (created_at DESC, id);

-- Full-text search index
ALTER TABLE listings ADD FULLTEXT INDEX idx_search (title, location, description);

-- Unique constraint on saved listings (prevent duplicates)
ALTER TABLE saved_listings ADD UNIQUE KEY uq_user_listing (user_id, listing_id);
```

### 3.5 Django Model Sketches

**`apps/accounts/models.py`**

```python
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
```

**`apps/listings/models.py`**

```python
class Listing(models.Model):
    user        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='listings')
    title       = models.CharField(max_length=200)
    location    = models.CharField(max_length=200)
    image_url   = models.URLField(max_length=500)
    description = models.TextField()
    price       = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    likes_count = models.PositiveIntegerField(default=0)
    created_at  = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

class SavedListing(models.Model):
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    listing    = models.ForeignKey(Listing, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'listing')
```

---

## 4. Backend Implementation

### 4.1 Django Settings Key Config

**`config/settings/base.py`** — critical sections:

```python
AUTH_USER_MODEL = 'accounts.User'

INSTALLED_APPS = [
    ...
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'django_filters',
    'apps.accounts',
    'apps.listings',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 12,
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='').split(',')
```

### 4.2 URL Configuration

**`config/urls.py`**

```python
urlpatterns = [
    path('api/auth/',     include('apps.accounts.urls')),
    path('api/listings/', include('apps.listings.urls')),
]
```

**`apps/accounts/urls.py`**

```python
urlpatterns = [
    path('register/',       RegisterView.as_view()),
    path('login/',          TokenObtainPairView.as_view()),
    path('logout/',         LogoutView.as_view()),
    path('token/refresh/',  TokenRefreshView.as_view()),
    path('me/',             MeView.as_view()),
]
```

**`apps/listings/urls.py`**

```python
router = DefaultRouter()
router.register(r'', ListingViewSet, basename='listing')

urlpatterns = [
    path('saved/',                      SavedListingsView.as_view()),
    path('<int:pk>/like/',              LikeListingView.as_view()),
    path('<int:pk>/save/',              SaveListingView.as_view()),
] + router.urls
```

### 4.3 Custom Permission

**`apps/listings/permissions.py`**

```python
from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.user == request.user
```

### 4.4 Search Filter

**`apps/listings/filters.py`**

```python
import django_filters
from .models import Listing

class ListingFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='filter_search')

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(title__icontains=value) |
            models.Q(location__icontains=value) |
            models.Q(description__icontains=value)
        )

    class Meta:
        model = Listing
        fields = ['search']
```

### 4.5 Listing ViewSet

```python
class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.select_related('user').all()
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filterset_class = ListingFilter

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
```

---

## 5. Frontend Implementation

### 5.1 Axios Instance with JWT Interceptor

**`src/api/axiosInstance.js`**

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,   // send httpOnly refresh cookie
});

// Attach access token from memory on every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, silently refresh and retry original request
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/token/refresh/`, {}, { withCredentials: true });
      useAuthStore.getState().setAccessToken(data.access);
      error.config.headers.Authorization = `Bearer ${data.access}`;
      return api(error.config);
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 5.2 Auth Store (Zustand)

**`src/store/authStore.js`**

```javascript
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, accessToken: null }),
}));

export default useAuthStore;
```

### 5.3 Protected Route

**`src/components/ProtectedRoute.jsx`**

```jsx
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function ProtectedRoute({ children, ownerOnly, listing }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (ownerOnly && listing?.user?.id !== user.id) return <Navigate to="/" replace />;
  return children;
}
```

### 5.4 React Router Setup

**`src/App.jsx`**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Register from './pages/Register';
import ListingDetail from './pages/ListingDetail';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                   element={<Feed />} />
        <Route path="/login"              element={<Login />} />
        <Route path="/register"           element={<Register />} />
        <Route path="/listings/:id"       element={<ListingDetail />} />
        <Route path="/create"             element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
        <Route path="/listings/:id/edit"  element={<ProtectedRoute><EditListing /></ProtectedRoute>} />
        <Route path="/profile"            element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*"                   element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 5.5 Search Debounce Utility

**`src/utils/timeAgo.js`**

```javascript
export function timeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days > 0)  return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
}
```

### 5.6 Listing Card Component Shape

Each card displays:
- Listing image (lazy-loaded)
- Title
- Location
- Description truncated to 120 characters
- Creator username
- Relative timestamp via `timeAgo()`
- Like / Save icons (visible to authenticated users only)

---

## 6. Authentication Flow

```
1. User submits email + password
        │
        ▼
2. POST /api/auth/login/
        │
        ▼
3. Django authenticates → SimpleJWT generates:
   - access token  (15 min TTL)  → returned in JSON body
   - refresh token (7 day TTL)   → set as httpOnly cookie
        │
        ▼
4. Frontend stores access token in memory (Zustand)
        │
        ▼
5. Axios interceptor attaches: Authorization: Bearer <access>
        │
        ▼
6. Any 401 response triggers:
   POST /api/auth/token/refresh/  (cookie sent automatically)
   → new access token stored in memory, original request retried
        │
        ▼
7. Logout → POST /api/auth/logout/ → refresh token blacklisted
           → Zustand cleared
```

**Security rules:**
- Access token: memory only (never `localStorage`, never a cookie)
- Refresh token: `httpOnly` cookie (inaccessible to JavaScript)
- CORS restricted to known Vercel domain in production

---

## 7. API Contracts

### Base URLs

| Environment | URL                            |
|-------------|--------------------------------|
| Local       | `http://localhost:8000/api/`   |
| Production  | `https://api.travs.app/api/v1` |

All protected endpoints require: `Authorization: Bearer <access_token>`

### Authentication Endpoints

| Method | Endpoint             | Auth     | Response              |
|--------|----------------------|----------|-----------------------|
| POST   | /auth/register/      | Public   | 201 — user object     |
| POST   | /auth/login/         | Public   | 200 — token pair      |
| POST   | /auth/logout/        | Required | 205 — no content      |
| POST   | /auth/token/refresh/ | Public   | 200 — new access token|
| GET    | /auth/me/            | Required | 200 — user profile    |

### Listings Endpoints

| Method | Endpoint              | Auth       | Description                            |
|--------|-----------------------|------------|----------------------------------------|
| GET    | /listings/            | Public     | All listings, newest first. `?search=` `?page=` |
| POST   | /listings/            | Required   | Create listing                         |
| GET    | /listings/{id}/       | Public     | Single listing detail                  |
| PUT    | /listings/{id}/       | Owner only | Full update                            |
| PATCH  | /listings/{id}/       | Owner only | Partial update                         |
| DELETE | /listings/{id}/       | Owner only | Delete listing                         |
| POST   | /listings/{id}/like/  | Required   | Toggle like                            |
| POST   | /listings/{id}/save/  | Required   | Toggle save / bookmark                 |
| GET    | /listings/saved/      | Required   | Current user's saved listings          |

### Sample Payload — Create Listing

```json
// POST /api/listings/
// Request
{
  "title": "Sunset Boat Tour",
  "location": "Bali, Indonesia",
  "image_url": "https://example.com/sunset-boat.jpg",
  "description": "Enjoy a beautiful sunset while sailing along the Bali coastline. Includes drinks and snacks.",
  "price": 45.00
}

// Response 201 Created
{
  "id": 12,
  "title": "Sunset Boat Tour",
  "location": "Bali, Indonesia",
  "image_url": "https://example.com/sunset-boat.jpg",
  "description": "Enjoy a beautiful sunset while sailing along the Bali coastline.",
  "price": "45.00",
  "likes_count": 0,
  "created_at": "2026-03-11T10:30:00Z",
  "user": {
    "id": 3,
    "username": "john_travels"
  }
}
```

---

## 8. Feature Build Checklist

### Required Features

- [ ] **User Registration** — form with username, email, password, confirm password + client-side validation → `POST /api/auth/register/`
- [ ] **User Login** — form with email + password; redirect to `/feed` on success → `POST /api/auth/login/`
- [ ] **User Logout** — clear Zustand state, redirect to `/login` → `POST /api/auth/logout/`
- [ ] **JWT Refresh** — silent token refresh on 401 via Axios interceptor → `POST /api/auth/token/refresh/`
- [ ] **Protected Routes** — unauthenticated users redirected to `/login` for `/create`, `/edit/:id`, `/profile`
- [ ] **Create Listing** — authenticated form with title, location, image_url, description, price → `POST /api/listings/`
- [ ] **Public Feed** — paginated (12/page), newest-first, visible to all → `GET /api/listings/`
- [ ] **Listing Detail Page** — full image, description, creator info, price ("Free" if null) → `GET /api/listings/{id}/`

### Optional Features

- [ ] **Edit Listing** — owner-only form → `PUT /api/listings/{id}/`
- [ ] **Delete Listing** — owner-only button with confirmation → `DELETE /api/listings/{id}/`
- [ ] **Search Listings** — debounced search bar (300ms) → `GET /api/listings/?search=`
- [ ] **Like Listing** — toggle like, update `likes_count` → `POST /api/listings/{id}/like/`
- [ ] **Save / Bookmark** — toggle save per listing → `POST /api/listings/{id}/save/`
- [ ] **Responsive UI** — tested at 375px, 768px, 1280px breakpoints using Tailwind
- [ ] **Pagination** — page-based or cursor-based, 12 items per page
- [ ] **Infinite Scroll** — `IntersectionObserver` on sentinel element
- [ ] **Image Upload** — multipart POST to Django `/media/` endpoint

---

## 9. Build Timeline

| Hours     | Phase              | Tasks                                                                                      |
|-----------|--------------------|--------------------------------------------------------------------------------------------|
| 0 – 2 h   | Project Setup      | Init Django project + React Vite app; configure MySQL; set up CORS; `git init` first commit |
| 2 – 5 h   | Auth — Backend     | Custom User model; register/login API; SimpleJWT config; test with Postman                 |
| 5 – 7 h   | Auth — Frontend    | Register + Login forms; Axios instance + interceptor; `ProtectedRoute`; token refresh       |
| 7 – 11 h  | Listings CRUD      | Django Listing model + migrations + DRF viewset; React Feed + Create + Detail pages        |
| 11 – 14 h | Optional Features  | Edit/Delete, Search, Like/Save — backend endpoints + frontend UI                          |
| 14 – 17 h | UI Polish          | Tailwind responsive design; loading states; error handling; empty states                   |
| 17 – 20 h | Deployment         | Deploy backend to Render; frontend to Vercel; configure env vars; smoke test live          |
| 20 – 22 h | README             | Write all sections including scaling answer + architecture decisions                       |
| 22 – 24 h | Buffer             | Bug fixes; final testing; clean up commits; submit                                         |

---

## 10. Deployment

### Frontend → Vercel

```bash
# In the frontend/ directory
npm run build

# Vercel CLI (or connect GitHub repo in Vercel dashboard)
vercel deploy --prod
```

Vercel environment variables to set:
```
VITE_API_URL = https://your-backend.onrender.com/api
```

### Backend → Render

1. Create a new **Web Service** on Render, connect GitHub repo
2. Set **Build Command**: `pip install -r requirements.txt`
3. Set **Start Command**: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
4. Add environment variables in Render dashboard:

```
SECRET_KEY
DEBUG=False
ALLOWED_HOSTS=your-backend.onrender.com
DB_NAME
DB_USER
DB_PASSWORD
DB_HOST
DB_PORT
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Database → PlanetScale / Railway

- Create a MySQL database instance
- Copy the connection string into backend `.env` values
- Run `python manage.py migrate` after first deploy

---

## 11. Scaling Notes

> Relevant when the platform reaches ~10,000+ listings.

### Database

| Change | Reason |
|--------|--------|
| Composite index on `(created_at DESC, id)` | Eliminates full table scan on feed queries |
| FULLTEXT index on `(title, location, description)` | Replaces slow `LIKE '%query%'` O(n) scans |
| Cursor-based (keyset) pagination | `OFFSET` pagination degrades as page number grows — keyset stays O(1) |

### Backend

| Change | Reason |
|--------|--------|
| Redis cache on `GET /listings/` (TTL: 60s) | Feed is read-heavy; caching removes 90%+ of DB hits |
| `select_related('user')` on listing queryset | Prevents N+1 queries when serialising creator data per listing |
| Rate limit listing creation (10/hour per IP) | Prevents spam writes; use `django-ratelimit` |

### Frontend

| Change | Reason |
|--------|--------|
| Virtual scrolling (`react-virtual`) | Only renders visible DOM nodes, not all 10k cards |
| `loading="lazy"` on listing images | Defers off-screen image loads; reduces bandwidth |
| WebP images via CDN (Cloudflare / imgix) | Smaller file sizes; `srcset` for responsive widths |
| Search debounce (300ms) | Prevents API call on every keystroke |

---

## Evaluation Criteria

| Category           | Points | What's Expected                                          |
|--------------------|--------|----------------------------------------------------------|
| Functionality      | 30 pts | Auth works, CRUD works, feed + detail renders correctly  |
| Code Quality       | 20 pts | Clean structure, no dead code, meaningful names, DRY     |
| UI / UX            | 15 pts | Responsive, polished, intuitive — looks like a real product |
| Database Structure | 15 pts | Proper schema, correct FK relationships, indexes         |
| Documentation      | 10 pts | README complete with all required sections + scaling answer |
| Optional Features  | 10 pts | Search, like/save, edit, delete, pagination              |
| **TOTAL**          | **100 pts** |                                                     |

---

*TravS — Development Guide v1.0 | Internal Use Only*
