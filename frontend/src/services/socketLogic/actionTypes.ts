import { SocketClient } from "./state";

export const CONNECT = "SOCKETIO:SOCKET:CONNECT";
export const SET_SOCKET = "SOCKETIO:SOCKET:SET";

export interface SetSocket {
	io: SocketClient;
}
