import {inflateRaw} from "$compress/zlib/inflate.ts";
import {deflateRaw} from "$compress/zlib/deflate.ts";

export enum Value {
	NUMBER,
	STRING,
	BOOLEAN
}

//@ts-ignore
export type EntityValueDeclaration = Record<string, Value | EntityValueDeclaration> | Value[];

export type ObjectValue = Record<string, string> | string | number | boolean | Object;

export const DPRK = () => {
	const encode = (declaration: EntityValueDeclaration, object: ObjectValue | ObjectValue[]): Uint8Array => {
		const encodeRAW = (declaration: EntityValueDeclaration, object: ObjectValue | ObjectValue[]): string => {
			
			const encodeValue = (value: ObjectValue | ObjectValue[], valueType: Value | Value[]): any => {
				if (valueType === Value.BOOLEAN)
					return value ? 1 : 0
				
				if(Array.isArray(valueType)) {
					const arrayValue = value as ObjectValue[];
					return `${arrayValue.length}⃌${arrayValue.map((childValue: ObjectValue) => encodeValue(childValue, valueType[0])).join('⃌')}`
				}
				
				if(typeof valueType === 'object')
					return encodeRAW(valueType, value)
				
				return value;
			}
			
			return Object.keys(declaration)
				.map((key: string) => {
					const value = (object as Record<string, string>)[key];
					const valueType = declaration[key]
					
					return encodeValue(value, valueType);
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
	
	const decode = (declaration: EntityValueDeclaration, arrayBuffer: ArrayBuffer): string => {
		const inflatedData = inflateRaw(new Uint8Array(arrayBuffer))
		const data = new TextDecoder().decode(inflatedData)
			.split(/⃌/gm)
		
		const decodeDeclaration = (declaration: any): any => Object.keys(declaration).reduce((obj, key) => ({...obj, [key]: decode(declaration[key]) }), {})
		
		const decode = (valueType: Value): any => {
			let value;
			
			if (valueType === Value.STRING)
				value = data.shift();
			else if (valueType === Value.BOOLEAN)
				value = data.shift() === '1';
			
			else if (valueType === Value.NUMBER)
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
	
	return {
		encode,
		decode
	}
};