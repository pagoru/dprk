
import {serve} from "$deno/http/server.ts";
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
	array: [2, 5, 2, 98765435678],
	someAnidationHereMaybe: {
		maybeYouAreRight: 'THIS IS A TEST',
		youAreAbsolutlyRight: false
	}
}

function handler(req: Request): Response {
	
	const match = route.exec(req.url);
	
	if (match) {
		
		const encoded = encodeDPRK(userDeclaration, user);
		
		const dprkLength = encoded.length;
		const jsonLength = new TextEncoder().encode(JSON.stringify(user)).length;
		const percent = Math.trunc((1 - (dprkLength / jsonLength)) * 100_00) / 100;
		console.log(`-${percent}%`)
		return new Response(encoded, {
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