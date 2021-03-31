from django.core.management import BaseCommand
from SuperFarmer import settings
from sockets.events import EVENTS_EMIT, EVENTS_ON

class Command(BaseCommand):
    def handle(self, *args, **options):
        string = """namespace IO {
    enum ServerEvents {
"""

        for key, value in EVENTS_EMIT.items():
            string += "        {} = \"{}\",\n".format(key, value)

        string += """    }

    enum ClientEvents {
"""

        for key, value in EVENTS_ON.items():
            string += "        {} = \"{}\",\n".format(key, value)

        string += """    }

    interface ServerEventsMap {
        [key: ServerEvents]: any;
    }

    interface ClientEventsMap {
        [key: ClientEvents]: any;
    }
}
"""

        with open(settings.FRONTEND_EVENTS_FILE, "w") as events_file:
            events_file.write(string)
