# Generated by Django 3.1.7 on 2021-04-04 18:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authorization', '0004_auto_20210326_1745'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_room_admin',
            field=models.BooleanField(default=False),
        ),
    ]