import { AnyAction } from "redux";

interface EmptyActionCreator {
	(): AnyAction;
}

interface ActionCreator<T> {
	(data: T): AnyAction & T;
}

export default function createAction(type: string): EmptyActionCreator;
export default function createAction<T>(type: string): ActionCreator<T>;
export default function createAction<T>(type: string): EmptyActionCreator | ActionCreator<T> {
	return (data?: T): AnyAction & T => Object.assign({ type }, data);
}
