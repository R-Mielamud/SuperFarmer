import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Socket } from "socket.io-client";
import { RootState } from "../typings/state";

interface Handler {
	(io: Socket): void;
}

interface HandlerSettings {
	handle?: Handler;
	handleOnce?: Handler;
}

export default function useIO(handler: HandlerSettings, deps: any[] = []): void {
	const location = useLocation();
	const { io } = useSelector((state: RootState) => state.socket);

	useEffect(() => {
		if (handler.handleOnce && io) {
			handler.handleOnce(io);
		}

		return () => void io?.off();
	}, [location.pathname, io]);

	useEffect(() => {
		if (handler.handle && io) {
			handler.handle(io);
		}

		return () => void io?.off();
	}, [...deps, location.pathname, io]);
}
