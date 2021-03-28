import { combineReducers } from "redux";
import { authReducer } from "../containers/LoginPage/login/reducer";
import { RootState } from "../typings/state";

const rootReducer = combineReducers<RootState>({
	auth: authReducer,
});

export default rootReducer;
