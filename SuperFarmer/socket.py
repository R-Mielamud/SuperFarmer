from __future__ import absolute_import
from socketio import Server
from SuperFarmer import settings

io = Server(logger=settings.DEBUG)
