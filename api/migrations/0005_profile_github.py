# Generated by Django 4.2.4 on 2024-04-21 19:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_profile_experience'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='github',
            field=models.URLField(blank=True),
        ),
    ]
