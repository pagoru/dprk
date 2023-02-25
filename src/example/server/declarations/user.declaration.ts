import {EntityDeclaration, ValueType} from "../../library/mod.ts";

export default {
	name: 'User',
	type: {
		id: ValueType.NUMBER,
		name: ValueType.STRING,
		obj: {
			test: ValueType.BOOLEAN,
			foo: ValueType.NUMBER,
			obj: [{
				test: ValueType.BOOLEAN,
				foo: ValueType.NUMBER
			}],
			custom: 'Auth'
		}
	},
	requests: {
		getUser: {
			props: {
				id: ValueType.NUMBER
			},
			response: 'User'
		},
		getUsers: {},
		updateUser: {
			props: {
				id: ValueType.NUMBER
			}
		}
	}
} as EntityDeclaration