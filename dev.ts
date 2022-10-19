import { config } from "$deno/dotenv/mod.ts";

const env = await config();
Object.keys(env)
    .forEach((key) => Deno.env.set(key, env[key]));

import './main.ts';