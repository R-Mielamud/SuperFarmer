import { useEffect, useState } from "react";
import { io as connect, Socket } from "socket.io-client";
import { getToken } from "../helpers/token.helper";

interface Handler {
	(io: Socket): void;
}

export default function useIO(handle: Handler) {
	const [io, setIO] = useState<Socket<IO.ServerEventsMap, IO.ClientEventsMap> | null>(null);

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
			const listeners = io.listenersAny();
			listeners.splice(0, listeners.length);

			handle(io);
		}
	}, []);
}
