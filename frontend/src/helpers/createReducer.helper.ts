import { AnyAction, Reducer } from "redux";

interface Handler<S> {
	(state: S, action: any): S;
}

interface Handlers<S> {
	[key: string]: Handler<S>;
}

export default function createReducer<S>(initialState: S, reducers: Handlers<S>): Reducer<S> {
	return (state = initialState, action: AnyAction) => {
		if (reducers.hasOwnProperty(action.type)) {
			return reducers[action.type](state, action);
		}

		return state;
	};
}
