
//Generic
import {inflateRaw} from "https://deno.land/x/compress@v0.4.4/zlib/inflate.ts";

export enum ValueType {
	NUMBER,
	STRING,
	BOOLEAN
}

export type ValueTypes = Record<string, ValueType | ValueTypes> | ValueType[];


export const encodeDPRK = (declaration: ValueTypes, object: Object): string => {
	
	return Object.keys(declaration)
		.map((key) => {
			const value = object[key];
			const valueType = declaration[key]
			
			if (valueType === ValueType.BOOLEAN)
				return value ? 1 : 0
			
			if(Array.isArray(valueType))
				return undefined
			
			if(typeof valueType === 'object')
				return encodeDPRK(valueType, value)
			
			return value;
		})
		.join('⃌')
}
export const decodeDPRK = (declaration: ValueTypes, arrayBuffer: ArrayBuffer): string => {
	const inflatedData = inflateRaw(new Uint8Array(arrayBuffer))
	const data = new TextDecoder().decode(inflatedData)
		.split(/⃌/gm)
	
	return Object.keys(declaration).reduce((obj, key, index) => {
		let value = data[index];
		const valueType = declaration[key];
		
		if (valueType === ValueType.BOOLEAN)
			value = value === '1';
		
		else if (valueType === ValueType.NUMBER)
			value = parseInt(value);
		
		else if(Array.isArray(valueType))
			value = value
		
		// else if(typeof valueType === 'object') {
		// 	value = ''
		// }
		
		return {
			...obj,
			[key]: value
		}
	}, {})
}

//Example

export const userDeclaration: ValueTypes = {
	id: ValueType.NUMBER,
	name: ValueType.STRING,
	email: ValueType.STRING,
	isAdmin: ValueType.BOOLEAN,
	object: {
		foo: ValueType.STRING,
		faa: ValueType.NUMBER
	},
	array: [ValueType.STRING],
}
