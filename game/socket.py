from django.db.models import F, Count
from sockets.events import EVENTS_ON, EVENTS_EMIT
from helpers.random_string import generate_random_string

def game_handler(io):
    @io.on(EVENTS_ON["GET_ROOMS"])
    def get_rooms(sid):
        from game.models import Room

        return Room.serialize_many(
            Room
                .objects
                .annotate(users_count=Count("users"))
                .filter(users_count__lte=3)
                .exclude(game_started=True)
        )

    @io.on(EVENTS_ON["JOIN_ROOM"])
    def join_room(sid, socket_id):
        from game.models import Room, GameState
        from authorization.models import User

        session = io.get_session(sid)
        room = Room.objects.filter(socket_id=socket_id)
        room_singular = room.first()

        if not room_singular:
            return

        user = User.objects.filter(pk=session["id"])
        user_singular = user.first()
        state = GameState.objects.create(user=user.first(), room=room_singular)
        user.update(room=room_singular, is_room_admin=False, number_in_room=room_singular.connected + 1)

        io.emit(EVENTS_EMIT["JOINED_ROOM"], {
            "id": socket_id,
            "user": user_singular.id,
            "num_in_room": user_singular.number_in_room,
        })

        return socket_id

    @io.on(EVENTS_ON["CREATE_ROOM"])
    def create_room(sid, name):
        from game.models import Room, GameState
        from authorization.models import User

        session = io.get_session(sid)
        code = generate_random_string()
        socket_id = "game-{}".format(code)

        room = Room.objects.create(name=name, socket_id=socket_id)
        user = User.objects.filter(pk=session["id"])

        user.update(room=room, is_room_admin=True, number_in_room=room.connected + 1)
        state = GameState.objects.create(user=user.first(), room=room)

        io.emit(EVENTS_EMIT["CREATED_ROOM"], room.self_serialize())

        return socket_id

    @io.on(EVENTS_ON["LEAVE_ROOM"])
    def leave_room(sid):
        from game.models import Room, GameState
        from authorization.models import User

        session = io.get_session(sid)
        user = User.objects.filter(pk=session["id"])
        user_singular = user.first()
        room_id = user_singular.room.pk
        connected = user_singular.room.connected

        if user_singular.room.connected == 1:
            user_singular.room.delete()

        GameState.objects.filter(user__pk=user_singular.pk).delete()
        user.update(room=None)

        io.emit(EVENTS_EMIT["LEFT_ROOM"], {
            "id": room_id,
            "connected": connected - 1,
        })

        return user_singular.pk

    @io.on(EVENTS_ON["GET_CURRENT_ROOM"])
    def get_current_room(sid):
        from game.models import Room
        from authorization.models import User

        session = io.get_session(sid)
        user = User.objects.filter(pk=session["id"]).first()

        if not user or not user.room:
            return

        return user.room.self_serialize_detailed(current_user_id=user.pk)
