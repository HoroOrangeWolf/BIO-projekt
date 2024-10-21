from django.urls import path
from .views import RegisterView, LoginView, LogoutView, SetupTOTPView, get_csrf_token, CurrentUserView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('setup-totp/', SetupTOTPView.as_view(), name='setup-totp'),
    path('csrf-token/', get_csrf_token, name='csrf-token'),
    path('current-user/', CurrentUserView.as_view(), name='current-user'),
]
