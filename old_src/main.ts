import { ObjectModel } from './types.ts'

// type EntityQueries = {
//     getEntity: (name: string) => Entity | undefined;
// }
// type Entity = {
//     id: string;
//     name: string;
//     description: string;
// }

const EntityObjectModel: ObjectModel = {
    name: 'Entity',
    properties: {
        id: {
            type: 'number',
            visibility: 'private'
        },
        name: {
            type: 'string',
            visibility: 'public'
        },
        description: {
            type: 'string',
            writable: true,
            visibility: 'public'
        }
    },
//     queries: {
//         get,
//         update,
//         remove
// //         getEntity: (name: string) => 'string'
//     }
}


const getCapitalizedString = (text: string): string => text[0].toUpperCase() + text.slice(1)

const generateObjectModelFileDeclarations = ({
    name,
    properties
}: ObjectModel) => {
    const publicPropertyKeyList = Object.keys(properties)
        .filter((propertyKey) => properties[propertyKey].visibility === 'public');

    const functionList = publicPropertyKeyList
        .map((property) => {
            const { type, writable } = properties[property];
            return [
                writable ? `set${getCapitalizedString(property)}(${property}: ${type})` : undefined,
                `get${getCapitalizedString(property)}():`
            ].filter(row => Boolean(row))
        }).flat()

    const objectModel = [
        ['export type', name, '= {'],
        ...publicPropertyKeyList
            .map((propertyKey) => {
                const { type, writable } = properties[propertyKey];
                const capitalizedKey = getCapitalizedString(propertyKey);
                return [
                    writable ? ['', `set${capitalizedKey}(${propertyKey}: ${type}):`, `Promise<${type}>;`] : undefined,
                    ['', `get${capitalizedKey}():`, `Promise<${type}>;`]
                ].filter(row => Boolean(row))
            }).flat(),
        ['}']
    ] as string[][];

    Deno.writeTextFile(`./__gen__/${name}.ts`, generateFunctionText(objectModel));
}

const generateFunctionText = (list: string[][]) => {
    return list.reduce((text, row) => {
        const generatedRowText = row.reduce((rowText, item, index) => {
            return `${rowText}${index === 0 ? '' : ' '}${item.length === 0 ? '   ' : item}`;
            }, '');
        return `${text}${generatedRowText}\n`
    }, '')
}

const Server = (() => {
    const objectModelFunctionsMap: any[] = [];

    const addObjetModel = (objectModel: ObjectModel) => {
        const { properties } = objectModel;

        const publicPropertyKeyList = Object.keys(properties)
            .filter((propertyKey) => properties[propertyKey].visibility === 'public');

        const objectModelFunctions = publicPropertyKeyList
            .reduce((obj, propertyKey) => {
                const { writable } = properties[propertyKey];
                const capitalizedKey = getCapitalizedString(propertyKey);

                return ({
                    ...obj,
                    [`get${capitalizedKey}`]: () => {
                        //TODO
                        console.log('get', propertyKey)
                    },
                    ...writable ? {
                        [`set${capitalizedKey}`]: (...args: any[]) => {
                            //TODO
                            console.log('set', propertyKey, args)
                        }
                    } : {}
                })
            }, {})
        generateObjectModelFileDeclarations(objectModel);
        return objectModelFunctionsMap.push(objectModelFunctions) - 1;
    }

    const getObjectModel = (objectModelId: number) => {
        const objectModelFunctions = objectModelFunctionsMap[objectModelId];

        console.log(objectModelFunctions)
    }

    return {
        addObjetModel,
        getObjectModel
    }
})();

const objectModelId = Server.addObjetModel(EntityObjectModel);
Server.getObjectModel(objectModelId)
/**
** -----------------------------------------------------------------------------------------------------------
**/

// const process = () => {
//     const publicOjectKeyList = Object.keys(entity).filter(key => !key.startsWith('$'));
//     console.log(publicOjectKeyList)
// }
// process();

/**
** -----------------------------------------------------------------------------------------------------------
** -----------------------------------------------------------------------------------------------------------
** -----------------------------------------------------------------------------------------------------------
**/
