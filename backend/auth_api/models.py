from email.policy import default

from django.contrib.auth.models import AbstractUser
from django.db import models


class AuthUser(AbstractUser):
    pesel = models.CharField(max_length=255, default='')
