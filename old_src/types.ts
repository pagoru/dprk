
export type ObjectModel = {
    name: string;
    properties: Record<string, {
        type?: 'string' | 'number',
    writable?: boolean,
    visibility?: 'private' | 'public'
    }>;
    //     queries: Record<string, {}>
}