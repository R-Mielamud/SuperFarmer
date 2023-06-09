import { all, call, put, select, takeEvery } from "redux-saga/effects";
import * as actionTypes from "./actionTypes";
import * as actions from "./actions";
import * as service from "../../../services/auth.service";
import { removeToken, setToken } from "../../../helpers/token.helper";
import history from "../../../helpers/history.helper";
import { error } from "../../../helpers/notifications.helper";
import { connect } from "../../../services/socketLogic/actions";

function* maybeConnectSocket() {
	const {
		socket: { io },
	} = yield select();

	if (!io) {
		yield put(connect());
	}
}

function* login(action: ReturnType<typeof actions.login>) {
	try {
		const result: WebApi.Specific.AuthResult = yield call(service.login, action.data);
		setToken(result.jwt_token);
		yield put(actions.authSuccess({ jwtToken: result.jwt_token, user: result.user }));
		yield* maybeConnectSocket();
	} catch (err) {
		yield put(actions.authSuccess({}));
		error(err.text);
	}
}

function* watchLogin() {
	yield takeEvery(actionTypes.LOGIN, login);
}

function* register(action: ReturnType<typeof actions.register>) {
	try {
		const result: WebApi.Specific.AuthResult = yield call(service.register, action.data);
		setToken(result.jwt_token);
		yield put(actions.authSuccess({ jwtToken: result.jwt_token, user: result.user }));
		yield* maybeConnectSocket();
	} catch (err) {
		yield put(actions.authSuccess({}));
		error(err.text);
	}
}

function* watchRegister() {
	yield takeEvery(actionTypes.REGISTER, register);
}

function* loadProfile() {
	try {
		const result: WebApi.Entity.User = yield call(service.getProfile);
		yield put(actions.loadProfileSuccess({ user: result }));
		yield* maybeConnectSocket();
	} catch (err) {
		if (!/login|register/.test(window.location.href)) {
			history.push("/login");
			removeToken();
		}

		yield put(actions.loadProfileSuccess({}));
	}
}

function* watchLoadProfile() {
	yield takeEvery(actionTypes.LOAD_PROFILE, loadProfile);
}

export default function* authSaga() {
	yield all([watchLogin(), watchRegister(), watchLoadProfile()]);
}
