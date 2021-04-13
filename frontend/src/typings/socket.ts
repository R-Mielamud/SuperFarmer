export enum ServerEvents {
    JOINED_ROOM = "GAME:ROOMS:JOIN:SUCCESS",
    CREATED_ROOM = "GAME:ROOMS:CREATE:SUCCESS",
}

export enum ClientEvents {
    GET_ROOMS = "GAME:ROOMS:GET",
    JOIN_ROOM = "GAME:ROOMS:JOIN",
    CREATE_ROOM = "GAME:ROOMS:CREATE",
}

export interface ServerEventsMap {
    [key: string]: any;
}

export interface ClientEventsMap {
    [key: string]: any;
}
