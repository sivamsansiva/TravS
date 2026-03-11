from decouple import config as env
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from .serializers import RegisterSerializer, UserSerializer

REFRESH_COOKIE = 'refresh_token'
COOKIE_MAX_AGE = env('REFRESH_TOKEN_LIFETIME_DAYS', default=7, cast=int) * 24 * 60 * 60


class RegisterView(generics.CreateAPIView):
    serializer_class   = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(generics.RetrieveAPIView):
    serializer_class   = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class CookieTokenObtainPairView(TokenObtainPairView):
    """
    Login: returns access token in JSON body +
    sets refresh token as httpOnly cookie (inaccessible to JS).
    """
    def finalize_response(self, request, response, *args, **kwargs):
        if response.status_code == 200 and 'refresh' in response.data:
            refresh = response.data.pop('refresh')
            response.set_cookie(
                key=REFRESH_COOKIE,
                value=refresh,
                max_age=COOKIE_MAX_AGE,
                httponly=True,
                samesite='Lax',
                secure=not env('DEBUG', default=True, cast=bool),
            )
        return super().finalize_response(request, response, *args, **kwargs)


class CookieTokenRefreshView(TokenRefreshView):
    """
    Refresh: reads the refresh token from the httpOnly cookie instead of body.
    Returns a new access token + rotates the cookie.
    """
    def post(self, request, *args, **kwargs):
        refresh = request.COOKIES.get(REFRESH_COOKIE)
        if not refresh:
            return Response({'detail': 'Refresh token cookie missing.'}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = self.get_serializer(data={'refresh': refresh})
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        response = Response(serializer.validated_data, status=status.HTTP_200_OK)

        # Rotate the cookie with the new refresh token (ROTATE_REFRESH_TOKENS=True)
        if 'refresh' in serializer.validated_data:
            new_refresh = serializer.validated_data.pop('refresh')
            response.set_cookie(
                key=REFRESH_COOKIE,
                value=new_refresh,
                max_age=COOKIE_MAX_AGE,
                httponly=True,
                samesite='Lax',
                secure=not env('DEBUG', default=True, cast=bool),
            )
        return response


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh = request.COOKIES.get(REFRESH_COOKIE) or request.data.get('refresh')
        try:
            token = RefreshToken(refresh)
            token.blacklist()
        except Exception:
            pass  # already invalid — proceed with logout
        response = Response(status=status.HTTP_205_RESET_CONTENT)
        response.delete_cookie(REFRESH_COOKIE)
        return response
