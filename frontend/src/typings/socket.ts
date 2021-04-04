export enum ServerEvents {
    JOINED_ROOM = "GAME:ROOMS:JOIN:SUCCESS",
}

export enum ClientEvents {
    GET_ROOMS = "GAME:ROOMS:GET",
    JOIN_ROOM = "GAME:ROOMS:JOIN",
}

export interface ServerEventsMap {
    [key: string]: any;
}

export interface ClientEventsMap {
    [key: string]: any;
}
