import { ServiceClient } from "../__gen__/client.ts";

const client = ServiceClient('http://localhost:8000');

const user = await client.getUser(123)

console.log(user)