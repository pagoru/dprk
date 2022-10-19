export type Entity = {
    getName(): Promise<string>;
    setDescription(description: string): Promise<string>;
    getDescription(): Promise<string>;
}
