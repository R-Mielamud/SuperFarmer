import LocalStorageKeys from "../constansts/LocalStorageKeys";

export const getToken = (): string | null => {
	return localStorage.getItem(LocalStorageKeys.UserToken);
};

export const setToken = (token: string): void => {
	return localStorage.setItem(LocalStorageKeys.UserToken, token);
};

export const removeToken = (): void => {
	return localStorage.removeItem(LocalStorageKeys.UserToken);
};
