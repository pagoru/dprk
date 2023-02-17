import { inflateRaw } from "https://deno.land/x/compress@v0.4.4/mod.ts";
import {decodeDPRK, userDeclaration, ValueType} from "./lib.ts";

const client = () => {
	
	const getUser = async (id: string): Promise<User | undefined> => {
		const response = await fetch('http://localhost:8000/getUser', { method: 'POST' })
		
		const responseText = await response.arrayBuffer();
		return decodeDPRK(userDeclaration, responseText)
	}
	
	return {
		getUser
	}
}

const { getUser } = client();

getUser('test').then(console.log)