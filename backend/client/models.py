# Create your models here.
from django.db import models


class DoctorSpecialization(models.Model):
    specialization_name = models.CharField(max_length=255)

    class Meta:
        verbose_name = "DoctorSpecialization"
        verbose_name_plural = "DoctorSpecializations"


class DoctorDetails(models.Model):
    doctor_number = models.CharField(max_length=255)
    user = models.ForeignKey('auth_api.AuthUser', on_delete=models.CASCADE)
    doctor_specializations = models.ManyToManyField(DoctorSpecialization, related_name='specializations')

    class Meta:
        verbose_name = "DoctorDetail"
        verbose_name_plural = "DoctorDetails"


class Visit(models.Model):
    visit_name = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    expected_end_time = models.DateTimeField()
    is_approved_by_doctor = models.BooleanField(default=False)
    is_visit_finished = models.BooleanField(default=False)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    doctor = models.ForeignKey(DoctorDetails, on_delete=models.CASCADE, default=None)
    user = models.ForeignKey('auth_api.AuthUser', on_delete=models.CASCADE)

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
