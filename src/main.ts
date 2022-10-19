

// type EntityQueries = {
//     getEntity: (name: string) => Entity | undefined;
// }
// type Entity = {
//     id: string;
//     name: string;
//     description: string;
// }

type ObjectModel = {
    name: string;
    properties: Record<string, {
        type?: 'string' | 'number',
        writable?: boolean,
        visibility?: 'private' | 'public'
    }>;
//     queries: Record<string, {}>
}

const Entity: ObjectModel = {
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

const generateObjectModelTypeText = ({
    name,
    properties
}: ObjectModel) => {
    const publicPropertyKeyList = Object.keys(properties)
        .filter((property) => properties[property].visibility === 'public');

    const objectModel = [
        ['type', name, '= {'],
        ...publicPropertyKeyList
            .map((property) => {
                const { type, writable } = properties[property];
                return [
                    writable ? ['', `set${getCapitalizedString(property)}(${property}: ${type}):`, `Promise<${type}>;`] : undefined,
                    ['', `get${getCapitalizedString(property)}():`, `${type};`]
                ].filter(row => Boolean(row))
            }).flat(),
        ['}']
    ] as string[][];
    return generateFunctionText(objectModel);
}

const generateFunctionText = (list: string[][]) => {
    return list.reduce((text, row) => {
        const generatedRowText = row.reduce((rowText, item, index) => {
            return `${rowText}${index === 0 ? '' : ' '}${item.length === 0 ? '   ' : item}`;
            }, '');
        return `${text}${generatedRowText}\n`
    }, '')
}

Deno.writeTextFile('./__gen__/entity.ts', generateObjectModelTypeText(Entity))
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

type ExposedEntity = {
    getName(): string;

    getDescription(): string;
    setDescription(description: string): Promise<string>;
}

const exposedEntity: ExposedEntity = {} as any
