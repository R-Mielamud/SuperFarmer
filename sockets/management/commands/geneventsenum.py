from django.core.management import BaseCommand
from SuperFarmer import settings
from sockets.events import EVENTS

class Command(BaseCommand):
    def handle(self, *args, **options):
        string = """namespace Socket {
    enum Events {
"""

        for key, value in EVENTS.items():
            string += "        {} = \"{}\",\n".format(key, value)

        string += """    }
}
"""

        with open(settings.FRONTEND_EVENTS_FILE, "w") as events_file:
            events_file.write(string)
