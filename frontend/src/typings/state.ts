import AuthState from "../containers/LoginPage/login/state";
import SocketState from "../services/socketLogic/state";

export interface RootState {
	auth: AuthState;
	socket: SocketState;
}
