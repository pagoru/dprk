
const Client = () => {
    let socket: WebSocket;
    
    function logError(msg: string) {
        console.log(msg);
    }
    
    function handleConnected() {
        console.log("Connected to server ...");
    }
    
    async function handleMessage(blob: Blob) {
    
        const headerSize = 4;
        
        const [headerBlob, bodyBlob] = [
            new Response(blob.slice(0, headerSize)),
            new Response(blob.slice(headerSize))
        ]
        
        const [bodyType, test1, test2] = new Uint8Array(await headerBlob.arrayBuffer());
        
        let body;
        switch (bodyType) {
            case 0:
                body = JSON.parse(await bodyBlob.text())
                break;
            case 1:
                body = await bodyBlob.text()
                break;
            case 2:
                body = parseInt(await bodyBlob.text());
                break;
        }
        
        console.log(bodyType, test1, test2, body)
    }
    
    function handleError(e: Event | ErrorEvent) {
        console.log(e instanceof ErrorEvent ? e.message : e.type);
    }
    
    const connect = () => {
        console.log("Connecting to server ...");
        try {
            socket = new WebSocket("ws://localhost:8000");
            socket.onopen = () => handleConnected();
            socket.onmessage = (m) => handleMessage(m.data);
            socket.onclose = () => logError("Disconnected from server ...");
            socket.onerror = (e) => handleError(e);
        } catch (err) {
            logError("Failed to connect to server ... exiting");
        }
    }
    
    return {
        connect
    }
}

Client().connect();