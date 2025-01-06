from axes.decorators import axes_dispatch
from django.contrib.auth.models import Group
from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework import generics, permissions, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login, logout, authenticate
from .serializers import RegisterSerializer, UserSerializer
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.utils.decorators import method_decorator
from django_otp.plugins.otp_totp.models import TOTPDevice


class RegisterView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        group = Group.objects.get(name="pacjent")
        user.groups.add(group)


class CurrentUserView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})


class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    @method_decorator(ensure_csrf_cookie)
    @method_decorator(axes_dispatch)
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            serializer = UserSerializer(user)
            if TOTPDevice.objects.filter(user=user, confirmed=True).exists():
                if 'otp' in request.data:
                    device = TOTPDevice.objects.get(user=user, confirmed=True)
                    if device.verify_token(request.data['otp']):
                        login(request, user)
                        return Response(serializer.data)
                    else:
                        return Response({"detail": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({"detail": "OTP required"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                login(request, user)
                return Response(serializer.data)
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    @method_decorator(ensure_csrf_cookie)
    def post(self, request):
        logout(request)
        return Response({"detail": "Successfully logged out."})


class SetupTOTPView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        device, created = TOTPDevice.objects.get_or_create(user=user, name="Default")
        url = device.config_url
        return Response({"config_url": url})

    def post(self, request):
        user = request.user
        token = request.data.get('token')
        device = TOTPDevice.objects.filter(user=user).first()
        if device is None:
            return Response({"detail": "TOTP device not set up"}, status=status.HTTP_400_BAD_REQUEST)
        if device.verify_token(token):
            device.confirmed = True
            device.save()
            return Response({"detail": "TOTP device confirmed"})
        return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
