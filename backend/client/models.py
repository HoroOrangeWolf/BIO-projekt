# Create your models here.
from django.db import models


class DoctorSpecialization(models.Model):
    specialization_name = models.CharField(max_length=255)

    class Meta:
        verbose_name = "DoctorSpecialization"
        verbose_name_plural = "DoctorSpecializations"
        permissions = (
            ('can_add_specialization', 'Can add specialization'),
            ('can_edit_specialization', 'Can edit specialization'),
            ('can_delete_specialization', 'Can delete specialization'),
            ('can_get_specialization', 'Can get specialization'),
        )


class DoctorDetails(models.Model):
    doctor_number = models.CharField(max_length=255)
    user = models.ForeignKey('auth_api.AuthUser', on_delete=models.CASCADE, related_name='doctor_details')
    doctor_specializations = models.ManyToManyField(DoctorSpecialization, related_name='specializations')

    class Meta:
        verbose_name = "DoctorDetail"
        verbose_name_plural = "DoctorDetails"


class Visit(models.Model):
    visit_name = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    is_visit_finished = models.BooleanField(default=False)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    doctor = models.ForeignKey(DoctorDetails, on_delete=models.CASCADE, default=None)
    user = models.ForeignKey('auth_api.AuthUser', on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Visit"
        verbose_name_plural = "Visits"
        permissions = (
            ('can_add_visit', 'Can add visit'),
            ('can_edit_visit', 'Can edit visit'),
            ('can_delete_visit', 'Can delete visit'),
            ('can_get_visit', 'Can get visit'),
        )


class MedicalDocumentation(models.Model):
    file = models.FileField(upload_to='medical_docs/', null=True, blank=True)
    file_name = models.CharField(max_length=255)
    file_description = models.TextField()
    visit = models.ForeignKey(Visit, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Medical Documentation"
        verbose_name_plural = "Medical Documentations"
        permissions = (
            ('can_add_medical_documentation', 'Can add medical documentation'),
            ('can_edit_medical_documentation', 'Can edit medical documentation'),
            ('can_delete_medical_documentation', 'Can delete medical documentation'),
            ('can_get_medical_documentation', 'Can get medical documentation'),
        )
