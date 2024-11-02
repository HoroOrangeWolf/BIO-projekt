# Generated by Django 5.0.7 on 2024-11-02 10:49

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth_api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Visit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visit_name', models.CharField(max_length=255)),
                ('start_time', models.DateTimeField()),
                ('expected_end_time', models.DateTimeField()),
                ('is_approved_by_doctor', models.BooleanField(default=False)),
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
                ('visit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='auth_api.visit')),
            ],
            options={
                'verbose_name': 'Medical Documentation',
                'verbose_name_plural': 'Medical Documentations',
            },
        ),
    ]
