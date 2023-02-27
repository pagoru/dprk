export enum ValueType {
	NUMBER,
	STRING,
	BOOLEAN
}
//@ts-ignore
export type ValueTypes = Record<string, ValueType | ValueTypes> | ValueType[];

export type FunctionProps = PartialRecord<string, ValueTypes>;

export type RequestType = {
	props?: FunctionProps
	response?: string | ValueType;
}

export type PartialRecord<K extends keyof any, T> = {
	[P in K]?: T;
};

export type EntityDeclaration = {
	name: string,
	type: Record<string, ValueTypes>
	requests: PartialRecord<string, RequestType>
}