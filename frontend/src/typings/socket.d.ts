namespace IO {
    enum ServerEvents {
    }

    enum ClientEvents {
    }

    interface ServerEventsMap {
        [key: ServerEvents]: any;
    }

    interface ClientEventsMap {
        [key: ClientEvents]: any;
    }
}
