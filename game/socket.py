from django.db.models import F, Count
from sockets.events import EVENTS_ON, EVENTS_EMIT

def game_handler(io):
    @io.on(EVENTS_ON["GET_ROOMS"])
    def get_rooms(sid):
        from game.models import Room
        return Room.serialize_many(Room.objects.annotate(users_count=Count("users")).filter(users_count__lte=3))

    @io.on(EVENTS_ON["JOIN_ROOM"])
    def join_room(sid, socket_id):
        from game.models import Room
        from authorization.models import User

        session = io.get_session(sid)
        room = Room.objects.filter(socket_id=socket_id)
        room_singular = room.first()

        if not room_singular:
            return

        User.objects.filter(pk=session["id"]).update(room=room_singular, is_room_admin=False)
        io.emit(EVENTS_EMIT["JOINED_ROOM"], socket_id)

        return socket_id
