import { all } from "redux-saga/effects";
import authSaga from "../containers/LoginPage/login/saga";
import socketSaga from "../services/socketLogic/saga";

export default function* rootSaga() {
	yield all([authSaga(), socketSaga()]);
}
