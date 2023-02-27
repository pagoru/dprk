import {serve} from "$deno/http/server.ts";
import {
	GetUserRequestDeclaration,
	GetUserResponseDeclaration,
	UpdateUserRequestDeclaration
} from "../__gen__/declarations.ts";
import {DPRK, EntityValueDeclaration} from "../__gen__/dprk.ts";

type RouteRequest = {
	requestDeclaration: EntityValueDeclaration,
	responseDeclaration: EntityValueDeclaration,
	middleware: (params?: any) => Promise<any>
}

const routes: Record<string, RouteRequest> = {
	'/getUser': {
		requestDeclaration: GetUserRequestDeclaration,
		responseDeclaration: GetUserResponseDeclaration,
		middleware: async ({ id }) => {
			return {
				id,
				name: 'Pablo'
			}
		}
	}
}

const { decode, encode } = DPRK();
async function handler(req: Request): Promise<Response> {
	if(req.method !== 'POST')
		return new Response("Not found", {
			status: 500,
		});
	const routesKeys = Object.keys(routes);
	const routeIndex = routesKeys.findIndex((pathname) => new URLPattern({ pathname }).exec(req.url));
	
	const ms = Date.now();
	if(routeIndex >= 0) {
		const { requestDeclaration, responseDeclaration, middleware } = routes[routesKeys[routeIndex]];
		const data = await middleware(decode(requestDeclaration, await req.arrayBuffer()));
		const response =  new Response(encode(responseDeclaration, data));
		const ms2 = Date.now();
		console.log(`${ms2 - ms}ms`)
		return response;
	}
	
	return new Response("Not found", {
		status: 404,
	});
}

serve(handler);