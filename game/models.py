from django.db.models import *
from authorization.models import User
from SuperFarmer.base import Serializable

class Room(Model, Serializable):
    name = CharField(max_length=50)
    socket_id = CharField(max_length=200)

    @classmethod
    def serialize(cls, instance):
        return {
            "name": instance.name,
            "socket_id": instance.socket_id,
            "game_states": [state.serialize() for state in instance.game_states],
        }

class GameState(Model, Serializable):
    user = OneToOneField(to=User, on_delete=CASCADE, to_field="id")
    room = ForeignKey(to=Room, on_delete=CASCADE, related_name="game_states")
    rabbits = IntegerField(default=0)
    sheep = IntegerField(default=0)
    pigs = IntegerField(default=0)
    cows = IntegerField(default=0)
    horses = IntegerField(default=0)

    @classmethod
    def serialize(cls, instance):
        return {
            "user": instance.user.id,
            "rabbits": instance.rabbits,
            "sheep": instance.sheep,
            "pigs": instance.pigs,
            "cows": instance.cows,
            "horses": instance.horses,
        }
