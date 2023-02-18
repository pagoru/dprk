import {serve} from "$deno/http/server.ts";
import {deflateRaw} from "https://deno.land/x/compress@v0.4.4/mod.ts";
import {encodeDPRK, userDeclaration} from "./lib.ts";

const route = new URLPattern({pathname: "/getUser"});

const user = {
	id: 123234,
	name: 'name | with special | chars@',
	email: 'pablo@test.test',
	isAdmin: true,
	object: {
		foo: {
			faa: 3
		}
	},
	array: [2, 5, 2]
}

function handler(req: Request): Response {
	
	const match = route.exec(req.url);
	
	if (match) {
		
		const test = encodeDPRK(userDeclaration, user);
		const bytes = new TextEncoder().encode(test);
		
		const deflated = deflateRaw(bytes, {
			level: 9,
			to: 'string',
			gzip: true,
		});
		return new Response(deflated, {
			headers: new Headers({
				// 'Content-Encoding': 'gzip'
			})
		});
	}
	
	return new Response("Not found (try /books/1)", {
		status: 404,
	});
}

serve(handler);