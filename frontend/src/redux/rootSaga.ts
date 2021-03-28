import { all } from "redux-saga/effects";
import authSaga from "../containers/LoginPage/login/saga";

export default function* rootSaga() {
	yield all([authSaga()]);
}
