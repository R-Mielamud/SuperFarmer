import { Socket } from "socket.io-client";
import { ServerEventsMap, ClientEventsMap } from "../../typings/socket";

export type SocketClient = Socket<ServerEventsMap, ClientEventsMap>;

export default interface SocketState {
	io?: SocketClient;
	ioConnected: boolean;
}

export const initialState: SocketState = {
	ioConnected: false,
};
