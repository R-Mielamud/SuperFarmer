import { combineReducers } from "redux";
import { authReducer } from "../containers/LoginPage/login/reducer";
import { socketReducer } from "../services/socketLogic/reducer";
import { RootState } from "../typings/state";

const rootReducer = combineReducers<RootState>({
	auth: authReducer,
	socket: socketReducer,
});

export default rootReducer;
