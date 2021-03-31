from django.core.management import BaseCommand
from SuperFarmer import settings
from sockets.events import EVENTS_EMIT, EVENTS_ON

class Command(BaseCommand):
    def handle(self, *args, **options):
        string = """export enum ServerEvents {
"""

        for key, value in EVENTS_EMIT.items():
            string += "        {} = \"{}\",\n".format(key, value)

        string += """}

export enum ClientEvents {
"""

        for key, value in EVENTS_ON.items():
            string += "        {} = \"{}\",\n".format(key, value)

        string += """}

export interface ServerEventsMap {
    [key: string]: any;
}

export interface ClientEventsMap {
    [key: string]: any;
}
"""

        with open(settings.FRONTEND_EVENTS_FILE, "w") as events_file:
            events_file.write(string)
