# Generated by Django 5.0.7 on 2024-11-03 20:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('client', '0003_remove_visit_expected_end_time_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='visit',
            name='is_approved_by_doctor',
        ),
    ]