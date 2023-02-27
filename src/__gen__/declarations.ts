import {EntityValueDeclaration, Value} from "./dprk.ts";

/**** User ****/

/* GetUser */

export const GetUserRequestDeclaration: EntityValueDeclaration = {
	id: Value.NUMBER
}
export const GetUserResponseDeclaration: EntityValueDeclaration = {
	id: Value.NUMBER,
	name: Value.STRING
}

/* UpdateUser */

export const UpdateUserRequestDeclaration: EntityValueDeclaration = {
	id: Value.NUMBER,
	name: Value.STRING
}
export const UpdateUserResponseDeclaration: EntityValueDeclaration = {
	id: Value.NUMBER,
	name: Value.STRING
}