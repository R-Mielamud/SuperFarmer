export enum ServerEvents {
}

export enum ClientEvents {
        GET_ROOMS = "GAME:ROOMS:GET",
}

export interface ServerEventsMap {
    [key: string]: any;
}

export interface ClientEventsMap {
    [key: string]: any;
}
