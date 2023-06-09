import createAction from "../../helpers/createAction.helper";
import * as actionTypes from "./actionTypes";

export const connect = createAction(actionTypes.CONNECT);
export const setSocket = createAction<actionTypes.SetSocket>(actionTypes.SET_SOCKET);
