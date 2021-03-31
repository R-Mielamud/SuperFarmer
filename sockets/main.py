from __future__ import absolute_import
from socketio import Server
from SuperFarmer import settings
from helpers.jwt import extract_socket_user
from .handlers import handlers

io = Server(logger=settings.DEBUG, cors_allowed_origins=settings.SOCKETIO_CORS_ALLOWED_ORIGINS)

@io.event
def connect(sid, env, auth):
    if not auth or not auth.get("token"):
        return False

    user = extract_socket_user(auth["token"])

    if not user:
        return False

    return True

for handle in handlers:
    handle(io)
