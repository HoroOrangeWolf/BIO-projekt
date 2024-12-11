# Generated by Django 5.0.7 on 2024-12-04 20:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('client', '0004_remove_visit_is_approved_by_doctor'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='medicaldocumentation',
            name='file_path',
        ),
        migrations.AddField(
            model_name='medicaldocumentation',
            name='file',
            field=models.FileField(blank=True, null=True, upload_to='medical_docs/'),
        ),
    ]