# Generated by Django 5.0.7 on 2024-11-02 17:14

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='DoctorSpecialization',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('specialization_name', models.CharField(max_length=255)),
            ],
            options={
                'verbose_name': 'DoctorSpecialization',
                'verbose_name_plural': 'DoctorSpecializations',
            },
        ),
        migrations.CreateModel(
            name='DoctorDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('doctor_number', models.CharField(max_length=255)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('doctor_specializations', models.ManyToManyField(related_name='specializations', to='client.doctorspecialization')),
            ],
            options={
                'verbose_name': 'DoctorDetail',
                'verbose_name_plural': 'DoctorDetails',
            },
        ),
        migrations.CreateModel(
            name='Visit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visit_name', models.CharField(max_length=255)),
                ('start_time', models.DateTimeField()),
                ('expected_end_time', models.DateTimeField()),
                ('is_approved_by_doctor', models.BooleanField(default=False)),
                ('is_visit_finished', models.BooleanField(default=False)),
                ('description', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Visit',
                'verbose_name_plural': 'Visits',
            },
        ),
        migrations.CreateModel(
            name='MedicalDocumentation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file_path', models.FilePathField()),
                ('file_name', models.CharField(max_length=255)),
                ('file_description', models.TextField()),
                ('visit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='client.visit')),
            ],
            options={
                'verbose_name': 'Medical Documentation',
                'verbose_name_plural': 'Medical Documentations',
            },
        ),
    ]
