# Generated by Django 5.0.7 on 2024-11-02 17:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth_api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='authuser',
            name='pesel',
            field=models.CharField(default='', max_length=255),
        ),
    ]
