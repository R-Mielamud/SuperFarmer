# Generated by Django 3.1.7 on 2021-04-04 19:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0002_room_name'),
        ('authorization', '0005_user_is_room_admin'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='room',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='users', to='game.room'),
        ),
    ]
