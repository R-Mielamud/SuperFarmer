from django.db.models import *
from authorization.models import User

class Room(Model):
    socket_id = CharField(max_length=200)

class GameState(Model):
    user = OneToOneField(to=User, on_delete=CASCADE, to_field="id")
    room = ForeignKey(to=Room, on_delete=CASCADE, related_name="game_states")
    rabbits = IntegerField(default=0)
    sheep = IntegerField(default=0)
    pigs = IntegerField(default=0)
    cows = IntegerField(default=0)
    horses = IntegerField(default=0)
