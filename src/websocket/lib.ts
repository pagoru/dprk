
//Generic
import {inflateRaw} from "$compress/zlib/inflate.ts";
import {deflateRaw} from "$compress/zlib/deflate.ts";

export enum ValueType {
	NUMBER,
	STRING,
	BOOLEAN
}

//@ts-ignore
export type ValueTypes = Record<string, ValueType | ValueTypes> | ValueType[];


export const encodeDPRK = (declaration: ValueTypes, object: any): Uint8Array => {
	const encodeRAW = (declaration: ValueTypes, object: any): string => {
		
		const encode = (value: any, valueType: any): any => {
			if (valueType === ValueType.BOOLEAN)
				return value ? 1 : 0
			
			if(Array.isArray(valueType))
				return `${value.length}⃌${value.map((childValue: any) => encode(childValue, valueType[0])).join('⃌')}`
			
			if(typeof valueType === 'object')
				return encodeRAW(valueType, value)
			
			return value;
		}
		
		return Object.keys(declaration)
			.map((key) => {
				const value = object[key];
				const valueType = declaration[key]
				
				return encode(value, valueType);
			})
			.join('⃌')
	}
	const rawData = encodeRAW(declaration, object);
	const bytes = new TextEncoder().encode(rawData);
	
	return deflateRaw(bytes, {
		level: 9,
		to: 'string',
		gzip: true,
	});
}
export const decodeDPRK = (declaration: ValueTypes, arrayBuffer: ArrayBuffer): string => {
	const inflatedData = inflateRaw(new Uint8Array(arrayBuffer))
	const data = new TextDecoder().decode(inflatedData)
		.split(/⃌/gm)
	
	const decodeDeclaration = (declaration: any): any => Object.keys(declaration).reduce((obj, key) => ({...obj, [key]: decode(declaration[key]) }), {})
	
	const decode = (valueType: ValueType): any => {
		let value;
		
		if (valueType === ValueType.STRING)
			value = data.shift();
		else if (valueType === ValueType.BOOLEAN)
			value = data.shift() === '1';

		else if (valueType === ValueType.NUMBER)
			value = parseInt(data.shift()!);

		else if(Array.isArray(valueType)) {
			const length = parseInt(data.shift()!)
			value = Array.from({length}).map(() => decode(valueType[0]))
			
		} else if(typeof valueType === 'object') {
			value = decodeDeclaration(valueType)
			
		}
		
		return value;
	}
	
	return decodeDeclaration(declaration);
	
}

//Example

export const userDeclaration: ValueTypes = {
	id: ValueType.NUMBER,
	name: ValueType.STRING,
	email: ValueType.STRING,
	isAdmin: ValueType.BOOLEAN,
	object: {
		foo: {
			faa: ValueType.NUMBER
		}
	},
	array: [ValueType.NUMBER],
	someAnidationHereMaybe: {
		maybeYouAreRight: ValueType.STRING,
		youAreAbsolutlyRight: ValueType.BOOLEAN
	}
}
