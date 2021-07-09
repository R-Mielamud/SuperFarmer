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
            state = GameState.objects.create(
                user=user_singular, room=room_singular)

        user.update(room=room_singular, is_room_admin=False,
                    number_in_room=room_singular.connected + 1)

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

        user.update(room=room, is_room_admin=True,
                    number_in_room=room.connected + 1)

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

    @io.on(EVENTS_ON["PROCESS_DICE"])
    def process_dice(sid, data):
        from game.models import GameState, Room
        from authorization.models import User

        def success():
            io.emit(EVENTS_EMIT["DICE_PROCESSED"], {
                "data": data,
                "game_state": game_state.first().self_serialize(),
            })

        session = io.get_session(sid)
        user = User.objects.filter(pk=session["id"]).first()

        if not user or not user.room or user.room.current_turn != user.number_in_room:
            return

        game_state = GameState.objects.filter(user=user)
        game_state_singular = game_state.first()

        if not game_state_singular:
            return

        if data["first"] == "fox" or data["second"] == "fox":
            if game_state_singular.has_small_dog:
                game_state.update(has_small_dog=False)
            else:
                game_state.update(rabbits=0)

        if data["first"] == "wolf" or data["second"] == "wolf":
            if game_state_singular.has_big_dog:
                game_state.update(has_big_dog=False)
            else:
                game_state.update(rabbits=0, sheep=0, pigs=0, cows=0)

            return success()

        if data["first"] == "fox" or data["second"] == "fox":
            return success()

        if data["first"] == data["second"]:
            current_value = getattr(game_state_singular, data["first"], 0)
            new_value = current_value + current_value // 2 + 1
            game_state.update(**{data["first"]: new_value})
        else:
            first_current_value = getattr(
                game_state_singular, data["first"], 0)

            second_current_value = getattr(
                game_state_singular, data["second"], 0)

            new_first_value = first_current_value + \
                (first_current_value + 1) // 2

            new_second_value = second_current_value + \
                (second_current_value + 1) // 2

            game_state.update(**{
                data["first"]: new_first_value,
                data["second"]: new_second_value,
            })

        Room.objects.filter(pk=user.room.pk).update(
            last_processed_dice=user.number_in_room)

        success()

    @io.on(EVENTS_ON["COMPLETE_TURN"])
    def complete_turn(sid):
        from game.models import Room
        from authorization.models import User

        session = io.get_session(sid)
        user = User.objects.filter(pk=session["id"]).first()

        if not user or not user.room or user.room.current_turn != user.number_in_room:
            return

        new_turn = user.room.current_turn + 1

        if new_turn > user.room.connected:
            new_turn = 1

        Room.objects.filter(pk=user.room.pk).update(current_turn=new_turn)
        current_turn_user = User.objects.filter(
            room=user.room, number_in_room=new_turn).first()

        io.emit(EVENTS_EMIT["NEXT_TURN"], {
            "room": user.room.socket_id,
            "user": current_turn_user.pk,
        })

    @io.on(EVENTS_ON["EXCHANGE_TOKENS"])
    def exchange_tokens(sid, data):
        from game.models import GameState
        from authorization.models import User

        first = data["first"]
        second = data["second"]

        session = io.get_session(sid)
        user = User.objects.filter(pk=session["id"]).first()

        if not user or not user.room or user.room.current_turn != user.number_in_room:
            return

        game_state = GameState.objects.filter(user=user)
        game_state_singular = game_state.first()

        if not game_state_singular:
            return

        update_data = {}
        first_value = getattr(game_state_singular, first["key"])
        second_value = getattr(game_state_singular, second["key"])

        first["key"] = first.get("key") or "rabbits"
        second["key"] = second.get("key") or "rabbits"

        first["count"] = first.get("count") or 1
        second["count"] = second.get("count") or 1

        def force_bool(value):
            return (True if value == 1 else False) if type(value) == int else value

        def force_int(value):
            return (1 if value else 0) if type(value) == bool else value

        def set_token(key, value):
            if key == "has_big_dog" or key == "has_small_dog":
                update_data[key] = force_bool(value)
            else:
                update_data[key] = force_int(value)

        if first["key"] == "has_big_dog" or first["key"] == "has_small_dog":
            set_token(first["key"], False)
            set_token(second["key"], force_int(second_value) + 1)
        else:
            set_token(first["key"], force_int(
                first_value) - force_int(first["count"]))

            set_token(second["key"], (second_value + second["count"])
                      if type(second_value) == int else (not second_value))

        game_state.update(**update_data)

        io.emit(EVENTS_EMIT["EXCHANGED_TOKENS"], {
            "room": user.room.socket_id,
            "user": user.id,
            "game_state": game_state.first().self_serialize(),
        })
