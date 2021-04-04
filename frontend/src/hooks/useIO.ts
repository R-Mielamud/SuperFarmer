import { useEffect, useState } from "react";
import { io as connect, Socket } from "socket.io-client";
import { getToken } from "../helpers/token.helper";
import { ServerEventsMap, ClientEventsMap } from "../typings/socket";

interface Handler {
	(io: Socket): void;
}

export default function useIO(handle: Handler, deps: any[] = []) {
	const [io, setIO] = useState<Socket<ServerEventsMap, ClientEventsMap> | null>(null);

	useEffect(() => {
		if (!io) {
			const token = getToken();

			if (!token) {
				throw new Error("Not authenticated");
			}

			const url = process.env.REACT_APP_SOCKET_IO_URL ?? "";
			const auth = { token: "Bearer " + token };
			const newIO = connect(url, { auth });

			setIO(newIO);
			handle(newIO);
		} else {
			io.off();
			handle(io);
		}
	}, deps);
}
