import { CompileMode, compileComponents, compileContent } from "./compiler.ts";
import { copy, ensureDir } from "https://deno.land/std@0.191.0/fs/mod.ts";

console.log("Building for production...");
const startTime = performance.now();

// create the dist directory
await ensureDir("./dist");

console.log("Compiling content...");
const content = await compileContent(CompileMode.PRODUCTION);
console.log("Compiling components...");
// returning a null should only ever happen during hot reloading in laggy conditions
const components = (await compileComponents(CompileMode.PRODUCTION))!;

// copy over assets
console.log("Copying assets...");
await copy("./assets", "./dist/assets", { overwrite: true });

await Deno.writeTextFile("./dist/index.html", content);
await Deno.writeTextFile("./dist/assets/components.js", components);

console.log(`\nDone in ${Math.round(performance.now() - startTime)}ms`);
