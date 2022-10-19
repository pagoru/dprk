type Entity = {
    getName(): string;
    setDescription(description: string): Promise<string>;
    getDescription(): string;
}

const entity: Entity = {} as Entity;

entity.getName()




/*
const pabloEntity = client.getEntity('Pablo');
// TOKEN [POST => "/0,'Pablo'" => 0]

pabloEntity.$uid = 0;

pabloEntity.getName();
// TOKEN [POST => "0,0
" => 'Pablo']

*/