import createReducer from "../../../helpers/createReducer.helper";
import AuthState, { authInitialState } from "./state";
import * as actionTypes from "./actionTypes";

export const authReducer = createReducer<AuthState>(authInitialState, {
	[actionTypes.LOGIN](state) {
		return {
			...state,
			authLoading: true,
		};
	},
	[actionTypes.REGISTER](state) {
		return {
			...state,
			authLoading: true,
		};
	},
	[actionTypes.AUTH_SUCCESS](state, action: actionTypes.LoadProfileSuccess) {
		return {
			...state,
			authLoading: false,
			user: action.user,
			jwtToken: action.jwtToken,
			isAuthorized: Boolean(action.user) && Boolean(action.jwtToken),
		};
	},
	[actionTypes.LOAD_PROFILE_SUCCESS](state, action: actionTypes.LoadProfileSuccess) {
		return {
			...state,
			profileLoaded: true,
			user: action.user,
			jwtToken: action.jwtToken,
			isAuthorized: Boolean(action.user) && Boolean(action.jwtToken),
		};
	},
});
