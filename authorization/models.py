from django.db.models import *

class User(Model):
    email = EmailField(unique=True)
    password = CharField(max_length=200)
    username = CharField(max_length=30)
    first_name = CharField(max_length=20, blank=True, null=True)
    last_name = CharField(max_length=20, blank=True, null=True)
    room = OneToOneField(to="game.Room", on_delete=CASCADE, to_field="id", blank=True, nul=True)
    is_active = True

    def __str__(self):
        return "{} email: {}".format(self.username, self.email)
