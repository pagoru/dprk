import {serve} from "$deno/http/mod.ts";
import {Utils} from "../utils/utils.ts";
import {BlobMessage, BodyType} from "./server/message.ts";

type ClientType = {
    id: number;
    socket: WebSocket;
}

const Server = () => {
    
    const clientRecord: Record<number, ClientType> = {};
    
    const requestHandler = (request: Request) => {
        if (request.headers.get("upgrade") !== "websocket") {
            return new Response(null, { status: 501 });
        }
        const { socket, response } = Deno.upgradeWebSocket(request);
        const id = Utils.uid.getUID();
        
        const onOpen = async (event: Event) => {
            console.log("Connected to client ...");
            clientRecord[id] = {
                id,
                socket
            }
            // socket.send(new Blob([new Uint8Array([0, 1, 22])]))
            // socket.send(new Blob([new Uint8Array([0, 324332423, 22])]))
            // socket.send(new Blob([new Uint8Array([0, 1, 22])]))
    
            
            
            socket.send(
                BlobMessage(
                    [BodyType.STRING, 34, 2],
                    'testing'
                )
            )
            // socket.send(new Blob( [JSON.stringify({ a: 'hola' })] ));
        }
        
        const onMessage = (message: MessageEvent) => {
            console.log(message.data);
        }
    
        const onError = (e: Event | ErrorEvent) => {
            console.log(e instanceof ErrorEvent ? e.message : e.type);
        }
    
        const onClose = () => {
            console.log('disconnected');
            delete clientRecord[id];
        }
        
        socket.onopen = onOpen;
        socket.onmessage = onMessage;
        socket.onclose = onClose;
        socket.onerror = onError;
        
        return response;
    }
    
    console.log("Waiting for client ...");
    
    
    const listen = (port: number) => serve(requestHandler, { port });
    
    return {
        listen
    }
}

Server().listen(8000)