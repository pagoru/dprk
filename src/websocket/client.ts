import {decodeDPRK, userDeclaration} from "./lib.ts";


await new Promise(r => setTimeout(() => r(), 300))

const client = () => {
	
	const getUser = async (id: string) => {
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