from django.contrib.auth.models import AbstractUser
from django.db import models


class AuthUser(AbstractUser):
    pesel = models.CharField(max_length=255)


class Visit(models.Model):
    visit_name = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    expected_end_time = models.DateTimeField()
    is_approved_by_doctor = models.BooleanField(default=False)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(AuthUser, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Visit"
        verbose_name_plural = "Visits"


class MedicalDocumentation(models.Model):
    file_path = models.FilePathField()
    file_name = models.CharField(max_length=255)
    file_description = models.TextField()
    visit = models.ForeignKey(Visit, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Medical Documentation"
        verbose_name_plural = "Medical Documentations"
