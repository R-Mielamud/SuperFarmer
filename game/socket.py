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
        user = User.objects.filter(pk=session["id"])
        user_singular = user.first()

        if not user_singular or user_singular.room:
            return

        room = Room.objects.filter(socket_id=socket_id)
        room_singular = room.first()

        if not room_singular or room_singular.game_started:
            return

        state = GameState.objects.filter(user__pk=user_singular.pk).first()

        if state:
            GameState.reset(state.pk)
        else:
            state = GameState.objects.create(user=user_singular, room=room_singular)

        user.update(room=room_singular, is_room_admin=False, number_in_room=room_singular.connected + 1)

        io.emit(EVENTS_EMIT["JOINED_ROOM"], {
            "id": socket_id,
            "user": user_singular.id,
            "number_in_room": room_singular.connected,
            "game_state": state.self_serialize(),
        })

    @io.on(EVENTS_ON["CREATE_ROOM"])
    def create_room(sid, name):
        from game.models import Room, GameState
        from authorization.models import User

        session = io.get_session(sid)
        code = generate_random_string()
        socket_id = "game-{}".format(code)

        room = Room.objects.create(name=name, socket_id=socket_id)
        user = User.objects.filter(pk=session["id"])
        user_singular = user.first()

        if not user_singular:
            return

        state = GameState.objects.filter(user__pk=user_singular.pk).first()

        if state:
            GameState.reset(state.pk)
        else:
            GameState.objects.create(user=user_singular, room=room)

        user.update(room=room, is_room_admin=True, number_in_room=room.connected + 1)
        io.emit(EVENTS_EMIT["CREATED_ROOM"], room.self_serialize())

    @io.on(EVENTS_ON["LEAVE_ROOM"])
    def leave_room(sid):
        from game.models import Room, GameState
        from authorization.models import User

        session = io.get_session(sid)
        user = User.objects.filter(pk=session["id"])
        user_singular = user.first()

        if not user_singular.room or user_singular.is_room_admin:
            return

        room_id = user_singular.room.socket_id
        room_pk = user_singular.room.pk
        connected = user_singular.room.connected

        if user_singular.room.connected == 1:
            Room.objects.filter(pk=room_pk).delete()

        GameState.objects.filter(user__pk=user_singular.pk).delete()
        user.update(room=None)

        io.emit(EVENTS_EMIT["LEFT_ROOM"], {
            "id": room_id,
            "user": user_singular.pk,
            "connected": connected - 1,
        })

    @io.on(EVENTS_ON["GET_CURRENT_ROOM"])
    def get_current_room(sid):
        from game.models import Room
        from authorization.models import User

        session = io.get_session(sid)
        user = User.objects.filter(pk=session["id"]).first()

        if not user or not user.room:
            return

        return user.room.self_serialize_detailed(current_user_id=user.pk)

    @io.on(EVENTS_ON["START_GAME"])
    def start_game(sid):
        from game.models import Room
        from authorization.models import User

        session = io.get_session(sid)
        user = User.objects.filter(pk=session["id"]).first()

        if not user or not user.room or not user.is_room_admin:
            return

        Room.objects.filter(pk=user.room.pk).update(game_started=True)

        io.emit(EVENTS_EMIT["GAME_STARTED"], {
            "id": user.room.socket_id,
            "admin": user.pk,
        })

    @io.on(EVENTS_ON["CANCEL_GAME"])
    def cancel_game(sid):
        from game.models import Room
        from authorization.models import User

        session = io.get_session(sid)
        user = User.objects.filter(pk=session["id"]).first()

        if not user or not user.room or not user.is_room_admin:
            return

        user.room.game_states.all().delete()
        room_id = user.room.socket_id
        room_pk = user.room.pk
        Room.objects.filter(pk=room_pk).delete()

        io.emit(EVENTS_EMIT["GAME_CANCELLED"], {
            "id": room_id,
            "admin": user.pk,
        })
