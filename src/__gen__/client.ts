import {DPRK, EntityValueDeclaration} from "./dprk.ts";
import {GetUserRequestDeclaration, GetUserResponseDeclaration, UpdateUserRequestDeclaration} from "./declarations.ts";

export const ServiceClient = (serviceUrl: string) => {
	
	const { encode, decode } = DPRK();
	const fetchRequest = async (
		requestName: string,
		requestDeclaration: EntityValueDeclaration,
		responseDeclaration: EntityValueDeclaration,
		content: any = {}
	) => {
		const body = encode(requestDeclaration, content)
		const response = await fetch(`${serviceUrl}/${requestName}`, { method: 'POST', body });
		return decode(responseDeclaration, await response.arrayBuffer());
	}
	
	return {
		getUser: (id: number): Promise<any> =>
			fetchRequest('getUser', GetUserRequestDeclaration, GetUserResponseDeclaration, { id }),
		// updateUser: (id: number, name: string): Promise<any> => fetchRequest('updateUser', encode(UpdateUserRequestDeclaration, { id, name }))
	}
}