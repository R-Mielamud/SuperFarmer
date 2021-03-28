export const LOGIN = "USER:AUTH:LOGIN";
export const REGISTER = "USER:AUTH:REGISTER";
export const AUTH_SUCCESS = "USER:AUTH:*:SUCCESS";
export const LOAD_PROFILE = "USER:AUTH:PROFILE:LOAD";
export const LOAD_PROFILE_SUCCESS = "USER:AUTH:PROFILE:LOAD:SUCCESS";

export interface Login {
	data: WebApi.Requests.UserLogin;
}

export interface Register {
	data: WebApi.Requests.UserRegister;
}

export interface AuthSuccess {
	user?: WebApi.Entity.User;
	jwtToken?: string;
}

export interface LoadProfileSuccess {
	user?: WebApi.Entity.User;
}
