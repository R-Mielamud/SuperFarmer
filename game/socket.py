from sockets.events import EVENTS_ON

def game_handler(io):
    @io.on(EVENTS_ON["GET_ROOMS"])
    def get_rooms(sid):
        from game.models import Room
        return Room.serialize_many(Room.objects.all())
