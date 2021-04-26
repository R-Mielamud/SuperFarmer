import { all, put, takeEvery } from "redux-saga/effects";
import { io as connectIO } from "socket.io-client";
import { getToken } from "../../helpers/token.helper";
import * as actions from "./actions";
import * as actionTypes from "./actionTypes";
import { SocketClient } from "./state";

function* connect() {
	const token = getToken();

	if (!token) {
		throw new Error("Not authenticated");
	}

	const url = process.env.REACT_APP_SOCKET_IO_URL ?? "";
	const auth = { token: "Bearer " + token };
	const io: SocketClient = connectIO(url, { auth });

	yield put(actions.setSocket({ io }));

	const unload = (event: string) =>
		function self() {
			io.disconnect();
			document.removeEventListener(event, self);
		};

	document.addEventListener("beforeunload", unload("beforeunload"));
	document.addEventListener("unload", unload("unload"));
}

function* watchConnect() {
	yield takeEvery(actionTypes.CONNECT, connect);
}

export default function* socketSaga() {
	yield all([watchConnect()]);
}
