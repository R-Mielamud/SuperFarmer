from __future__ import absolute_import
from socketio import Server
from SuperFarmer import settings

io = Server(logger=settings.DEBUG, cors_allowed_origins=settings.SOCKETIO_CORS_ALLOWED_ORIGINS)
