export type Client = () => {
    getEntity: (id: number) => Promise<Entity>;
}

export type Entity = {
    getId: () => Promise<number>;
}

const client: Client = () => {

    const getEntity = async (id: number) => {
        return new Promise((resolve, reject) => {
            socket.once('--', resolve);
            socket.emit('--', [0,id]);
        });
    }

    return {
        getEntity
    }
}
client;