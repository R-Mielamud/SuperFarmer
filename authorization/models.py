from django.db.models import *
from helpers.password import hash_password
from SuperFarmer.base import Serializable

class User(Model, Serializable):
    email = EmailField(unique=True)
    password = CharField(max_length=200)
    username = CharField(max_length=30, unique=True)
    first_name = CharField(max_length=20, blank=True, null=True)
    last_name = CharField(max_length=20, blank=True, null=True)
    room = ForeignKey(to="game.Room", on_delete=CASCADE, related_name="users", blank=True, null=True)
    is_room_admin = BooleanField(default=False)
    is_active = True

    def __str__(self):
        return "{} email: {}".format(self.username, self.email)

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.password = hash_password(self.password)

        return super().save(*args, **kwargs)

    @classmethod
    def serialize(cls, instance):
        return {
            "id": instance.pk,
            "first_name": instance.first_name,
            "last_name": instance.last_name,
            "email": instance.email,
            "username": instance.username,
            "room": instance.room.socket_id if instance.room else None,
        }
