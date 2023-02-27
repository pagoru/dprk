import { parse } from "https://deno.land/std@0.178.0/flags/mod.ts"
import { join } from "https://deno.land/std@0.178.0/path/mod.ts";
import {EntityDeclaration, RequestType, ValueType, ValueTypes} from './mod.ts';

const { path } = parse (Deno.args);

const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);
const deCapitalizeFirstLetter = (string: string) => string.charAt(0).toLowerCase() + string.slice(1);

const workingPath = join(Deno.cwd(), path);

const getStringTypeFRomValueType = (valueType: ValueType | ValueTypes, index: number = 1): string => {
	const tabulations: string = Array.from({ length: index }).reduce((tabs) => `\t${tabs}`, '\t')
	const tabulationsLast: string = Array.from({ length: index - 1 }).reduce((tabs) => `\t${tabs}`, '\t')
	
	if(typeof valueType === 'string')
		return `${valueType}`;
	
	if(Array.isArray(valueType)) {
		return `${getStringTypeFRomValueType(valueType[0], index)}[]`
	}
	
	if(typeof valueType === 'object') {
		return [
			'{',
			`${tabulations}${Object.keys(valueType).map((key) => `${key}: ${getStringTypeFRomValueType(valueType[key], index + 1)};`).join('\n' + tabulations)}`,
			`${tabulationsLast}}`
		].join('\n');
	}
	switch (valueType) {
		case ValueType.BOOLEAN:
			return 'boolean';
		case ValueType.STRING:
			return 'string';
		case ValueType.NUMBER:
			return 'number';
		default:
			return 'unknown';
	}
}

const getFunctionText = (functionName: string, { props, response }: RequestType) => {
	return [
		`type ${functionName} = (`,
		props ? Object.keys(props).map((propKey) => `${propKey}?: ${getStringTypeFRomValueType(props[propKey])}`).join(', ') : '',
		`) => Promise<${getStringTypeFRomValueType(response)}>`
	].join('')
}

let declarations = [];
for await (const { name: fileName, isFile } of Deno.readDir(workingPath)) {
	const match = /(.*)\.declaration\.ts/.exec(fileName);
	
	if(isFile && match) {
		const file = await import(join(path, fileName).replace(/\\/, '/'));
		const { name, type, requests } = file.default as EntityDeclaration;
		
		const capitalizedName = capitalizeFirstLetter(name);
		
		const functionNames = Object.keys(requests);
		
		const declaration = [
			'',
			`/** ${capitalizedName} **/`,
			'',
			`export type ${name} = {`,
			Object.keys(type).map((key) => `\t${key}: ${getStringTypeFRomValueType(type[key])};`).join('\n'),
			'}',
			'',
			functionNames.map((functionName) => getFunctionText(capitalizeFirstLetter(functionName), requests[functionName])).join('\n'),
			'',
			`export type ${capitalizedName}Client = {`,
			functionNames.map((functionName) => `\t${deCapitalizeFirstLetter(functionName)}: ${capitalizeFirstLetter(functionName)}`).join('\n'),
			'}',
			'',
			`/** ----- **/`
		].join('\n')
		
		declarations.push(declaration)
	}
}

Deno.writeTextFile(join(path, 'declarations.ts'), declarations.join('\n'))
// for (const readDirSyncKey in Deno.readFileSync(Deno.execPath())) {
//
// 	console.log(readDirSyncKey)
// }