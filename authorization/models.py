from django.db.models import *
from helpers.password import hash_password

class User(Model):
    email = EmailField(unique=True)
    password = CharField(max_length=200)
    username = CharField(max_length=30, unique=True)
    first_name = CharField(max_length=20, blank=True, null=True)
    last_name = CharField(max_length=20, blank=True, null=True)
    room = OneToOneField(to="game.Room", on_delete=CASCADE, to_field="id", blank=True, null=True)
    is_active = True

    def __str__(self):
        return "{} email: {}".format(self.username, self.email)

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.password = hash_password(self.password)

        return super().save(*args, **kwargs)
