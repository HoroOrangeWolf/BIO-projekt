import base64

import pyotp
import pytest
from django.contrib.auth import get_user_model
from django_otp.plugins.otp_totp.models import TOTPDevice
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


@pytest.mark.django_db
def test_successful_login_without_otp():
    # Tworzenie użytkownika
    user = User.objects.create_user(username='testuser', password='password123')
    client = APIClient()

    # Próba logowania
    response = client.post('/auth/login/', {'username': 'testuser', 'password': 'password123'})
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_successful_login_with_otp():
    # Tworzenie użytkownika i urządzenia OTP
    user = User.objects.create_user(username='testuser', password='password123')
    device = TOTPDevice.objects.create(user=user, confirmed=True)

    # Konwersja klucza binarnego na Base32
    secret_key = base64.b32encode(device.bin_key).decode('utf-8')

    # Generowanie prawidłowego OTP
    totp = pyotp.TOTP(secret_key)
    otp_token = totp.now()

    client = APIClient()
    response = client.post('/auth/login/', {
        'username': 'testuser',
        'password': 'password123',
        'otp': otp_token
    })
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_login_with_missing_otp():
    # Tworzenie użytkownika z OTP
    user = User.objects.create_user(username='testuser', password='password123')
    TOTPDevice.objects.create(user=user, confirmed=True)

    client = APIClient()
    response = client.post('/auth/login/', {'username': 'testuser', 'password': 'password123'})
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data['detail'] == 'OTP required'


@pytest.mark.django_db
def test_login_with_invalid_otp():
    # Tworzenie użytkownika i urządzenia OTP
    user = User.objects.create_user(username='testuser', password='password123')
    TOTPDevice.objects.create(user=user, confirmed=True)

    client = APIClient()
    response = client.post('/auth/login/', {
        'username': 'testuser',
        'password': 'password123',
        'otp': '123456'  # Nieprawidłowy OTP
    })
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data['detail'] == 'Invalid OTP'


@pytest.mark.django_db
def test_invalid_password():
    # Tworzenie użytkownika
    user = User.objects.create_user(username='testuser', password='password123')
    client = APIClient()

    response = client.post('/auth/login/', {'username': 'testuser', 'password': 'wrongpassword'})
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data['detail'] == 'Invalid credentials'


@pytest.mark.django_db
def test_axes_brute_force_block():
    # Tworzenie użytkownika
    user = User.objects.create_user(username='testuser', password='password123')
    client = APIClient()

    # Wielokrotne nieudane próby logowania
    for _ in range(5):  # Liczba prób zależy od konfiguracji Axes
        client.post('/auth/login/', {'username': 'testuser', 'password': 'wrongpassword'})

    # Próba logowania po blokadzie
    response = client.post('/auth/login/', {'username': 'testuser', 'password': 'password123'})
    assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS


@pytest.mark.django_db
def test_login_without_username_or_password():
    client = APIClient()

    # Brak nazwy użytkownika
    response = client.post('/auth/login/', {'password': 'password123'})
    assert response.status_code == status.HTTP_400_BAD_REQUEST

    # Brak hasła
    response = client.post('/auth/login/', {'username': 'testuser'})
    assert response.status_code == status.HTTP_400_BAD_REQUEST
