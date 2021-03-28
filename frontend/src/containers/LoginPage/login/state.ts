export default interface AuthState {
	isAuthorized: boolean;
	user?: WebApi.Entity.User;
	jwtToken?: string;
	authLoading: boolean;
	profileLoaded: boolean;
}

export const authInitialState: AuthState = {
	isAuthorized: false,
	authLoading: false,
	profileLoaded: false,
};
