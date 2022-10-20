
export enum BodyType {
    JSON,
    STRING,
    NUMBER,
    BUFFER_8,
    BUFFER_16,
    BUFFER_32
}

export const BlobMessage = (
    headers: [BodyType, number, number],
    body: object | string | number | Uint32Array
): Blob => {
    const [bodyType] = headers
    
    const bufferHeaders = new Uint8Array(new ArrayBuffer(4));
    bufferHeaders.set(headers);
    
    const blobParts: BlobPart[] = [
        bufferHeaders
    ]
    
    switch (bodyType) {
        case BodyType.JSON:
            blobParts.push(new TextEncoder().encode(JSON.stringify(body)));
            break;
        case BodyType.STRING:
        case BodyType.NUMBER:
            blobParts.push(new TextEncoder().encode(body as string));
            break;
    }
    
    return new Blob(blobParts);
}