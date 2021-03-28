import callWebApi, { Method } from "../helpers/callWebApi.helper";

export async function login(body: WebApi.Requests.UserLogin): Promise<WebApi.Specific.AuthResult> {
	const res = await callWebApi({
		endpoint: "auth/login",
		method: Method.Post,
		body,
		skipAuthorization: true,
	});

	return (await res.json()) as WebApi.Specific.AuthResult;
}

export async function register(body: WebApi.Requests.UserRegister): Promise<WebApi.Specific.AuthResult> {
	const res = await callWebApi({
		endpoint: "auth/register",
		method: Method.Post,
		body,
		skipAuthorization: true,
	});

	return (await res.json()) as WebApi.Specific.AuthResult;
}

export async function getProfile(): Promise<WebApi.Entity.User> {
	const res = await callWebApi({
		endpoint: "auth/profile",
		method: Method.Get,
	});

	return (await res.json()) as WebApi.Entity.User;
}
