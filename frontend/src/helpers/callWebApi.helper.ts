import qs from "qs";
import { DEFAULT_EXCEPTION_TEXT, WebApiException, WebApiExceptionProps } from "../typings/webapiException";
import { getToken } from "./token.helper";

const API = "api/";
const SLASH = "/";
const BASE_URL = process.env.REACT_APP_BASE_URL + "/";

export enum Method {
	Get = "GET",
	Post = "POST",
	Put = "PUT",
	Patch = "PATCH",
	Delete = "DELETE",
}

type Body =
	| string
	| Blob
	| ArrayBuffer
	| ArrayBufferView
	| FormData
	| URLSearchParams
	| ReadableStream<Uint8Array>
	| undefined
	| null;

interface Request {
	endpoint: string;
	method: Method;
	body?: any;
	query?: Record<string, any>;
	skipAuthorization?: boolean;
	attachment?: File;
	attachmentFieldName?: string;
}

export default async function callWebApi(request: Request): Promise<Response> {
	try {
		const response = await fetch(getFetchUrl(request), getFetchArgs(request));
		await throwIfResponseFailed(response);
		return response;
	} catch (err) {
		throw { text: DEFAULT_EXCEPTION_TEXT, ...err };
	}
}

async function throwIfResponseFailed(response: Response): Promise<never | void> {
	if (!response.ok) {
		const props: WebApiExceptionProps = {
			status: response.status,
			statusText: response.statusText,
			url: response.url,
		};

		try {
			props.clientException = await response.json();
		} catch {}

		throw new WebApiException(props);
	}
}

function getFetchUrl(request: Request): string {
	const query: string = request.query ? `?${qs.stringify(request.query)}` : "";
	const url: string = BASE_URL + API + request.endpoint + SLASH + query;

	return url;
}

function getFetchArgs(request: Request): RequestInit {
	const token: string | null = getToken();
	const headers: Headers | string[][] | Record<string, string> | undefined = {};
	let body: Body;

	if (!request.skipAuthorization && token) {
		headers.Authorization = `Bearer ${token}`;
	}

	if (request.attachment) {
		if (request.method === Method.Get) {
			throw new Error("GET request doesn't support attachments");
		}

		const formData = new FormData();
		const fieldName = request.attachmentFieldName ?? "file";
		formData.append(fieldName, request.attachment);

		if (request.body) {
			Object.entries(request.body).forEach(([key, value]) => formData.append(key, String(value)));
		}

		body = formData;
	} else if (request.body) {
		if (request.method === Method.Get) {
			throw new Error("GET request doesn't support request body");
		}

		body = JSON.stringify(request.body);

		const json = "application/json";
		headers["Content-Type"] = json;
		headers.Accept = json;
	}

	return {
		method: request.method,
		headers,
		...(request.method === Method.Get ? {} : { body }),
	};
}
