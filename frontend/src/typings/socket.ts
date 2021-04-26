export enum ServerEvents {
    JOINED_ROOM = "GAME:ROOMS:JOIN:SUCCESS",
    CREATED_ROOM = "GAME:ROOMS:CREATE:SUCCESS",
    LEFT_ROOM = "GAME:ROOMS:LEAVE:SUCCESS",
    GAME_STARTED = "GAME:START:SUCCESS",
    GAME_CANCELLED = "GAME:CANCEL:SUCCESS",
}

export enum ClientEvents {
    START_GAME = "GAME:START",
    CANCEL_GAME = "GAME:CANCEL",
    GET_ROOMS = "GAME:ROOMS:GET",
    JOIN_ROOM = "GAME:ROOMS:JOIN",
    LEAVE_ROOM = "GAME:ROOMS:LEAVE",
    CREATE_ROOM = "GAME:ROOMS:CREATE",
    GET_CURRENT_ROOM = "GAME:ROOMS:CURRENT:GET",
}

export interface ServerEventsMap {
    [key: string]: any;
}

export interface ClientEventsMap {
    [key: string]: any;
}
