import { assertEquals } from "$deno/testing/asserts.ts";
import {foo} from "./main.ts";

Deno.test("foo returns faa", () => {
    assertEquals(foo(), "faa");
});