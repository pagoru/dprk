import {EntityDeclaration, ValueType} from "../../library/mod.ts";

export default {
	name: 'Auth',
	type: {
		id: ValueType.NUMBER
	},
	requests: {
		getAuth: {
			props: {
				id: ValueType.NUMBER
			}
		}
	}
} as EntityDeclaration