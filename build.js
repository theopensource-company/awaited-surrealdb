import fs from "fs";

const src = fs.readFileSync('./src/index.ts').toString();
const updated = src.replaceAll('from "surrealdb.js"', 'from "https://deno.land/x/surrealdb@v0.5.0/mod.ts"');
fs.writeFileSync('./mod.ts', updated);