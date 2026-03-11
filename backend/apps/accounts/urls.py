from django.urls import path
from .views import RegisterView, MeView, LogoutView, CookieTokenObtainPairView, CookieTokenRefreshView

urlpatterns = [
    path('register/',      RegisterView.as_view()),
    path('login/',         CookieTokenObtainPairView.as_view()),
    path('logout/',        LogoutView.as_view()),
    path('token/refresh/', CookieTokenRefreshView.as_view()),
    path('me/',            MeView.as_view()),
]
