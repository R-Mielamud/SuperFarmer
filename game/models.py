from django.db.models import *
from authorization.models import User
from SuperFarmer.base import Serializable

class Room(Model, Serializable):
    name = CharField(max_length=50)
    socket_id = CharField(max_length=200)
    game_started = BooleanField(default=False)

    @property
    def connected(self):
        return self.users.count()

    def __str__(self):
        return self.name

    @classmethod
    def serialize(cls, instance):
        admin = instance.users.filter(is_room_admin=True).first()

        return {
            "id": instance.pk,
            "name": instance.name,
            "socket_id": instance.socket_id,
            "connected": instance.connected,
            "admin": admin.id if admin else None,
            "game_started": instance.game_started,
        }

    @classmethod
    def serialize_detailed(cls, instance, current_user_id):
        admin = instance.users.filter(is_room_admin=True).first()
        opponents = instance.users.exclude(id=current_user_id).values_list("id", flat=True)

        return {
            "id": instance.pk,
            "name": instance.name,
            "socket_id": instance.socket_id,
            "game_states": [GameState.serialize(state) for state in instance.game_states.all()],
            "admin": admin.id if admin else None,
            "opponents": list(opponents),
            "game_started": instance.game_started,
            "connected": instance.connected,
        }

class GameState(Model, Serializable):
    user = OneToOneField(to=User, on_delete=CASCADE, to_field="id")
    room = ForeignKey(to=Room, on_delete=CASCADE, related_name="game_states")
    rabbits = IntegerField(default=0)
    sheep = IntegerField(default=0)
    pigs = IntegerField(default=0)
    cows = IntegerField(default=0)
    horses = IntegerField(default=0)
    has_small_dog = BooleanField(default=False)
    has_big_dog = BooleanField(default=False)

    def __str__(self):
        return "Game state of user {} in {}".format(self.user.username, self.room.name)

    @classmethod
    def serialize(cls, instance):
        return {
            "id": instance.pk,
            "user": instance.user.id,
            "rabbits": instance.rabbits,
            "sheep": instance.sheep,
            "pigs": instance.pigs,
            "cows": instance.cows,
            "horses": instance.horses,
            "has_small_dog": instance.has_small_dog,
            "has_big_dog": instance.has_big_dog,
        }

    @classmethod
    def reset(cls, pk):
        cls.objects.filter(pk=pk).update(
            rabbits=0,
            sheep=0,
            pigs=0,
            cows=0,
            horses=0,
            has_small_dog=False,
            has_big_dog=False,
        )
