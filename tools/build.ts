import { CompileMode, compileComponents, compileContent } from "./compiler.ts";
import { copy, ensureDir } from "https://deno.land/std@0.191.0/fs/mod.ts";

// create the dist directory
await ensureDir("./dist");

const content = await compileContent(CompileMode.PRODUCTION);
const components = await compileComponents(CompileMode.PRODUCTION);

// copy over assets
copy("./assets", "./dist/assets");

await Deno.writeTextFile("./dist/index.html", content);
await Deno.writeTextFile("./dist/assets/components.js", components);