import createReducer from "../../helpers/createReducer.helper";
import * as actionTypes from "./actionTypes";
import SocketState, { initialState } from "./state";

export const socketReducer = createReducer<SocketState>(initialState, {
	[actionTypes.CONNECT](state) {
		return {
			...state,
			ioConnected: true,
		};
	},
	[actionTypes.SET_SOCKET](state, action: actionTypes.SetSocket) {
		return {
			...state,
			io: action.io,
		};
	},
});
