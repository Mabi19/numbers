"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_ts_1 = require("./compiler.ts");
var mod_ts_1 = require("https://deno.land/std@0.191.0/fs/mod.ts");
console.log("Building for production...");
var startTime = performance.now();
// create the dist directory
await (0, mod_ts_1.ensureDir)("./dist");
console.log("Compiling content...");
var content = await (0, compiler_ts_1.compileContent)(1 /* CompileMode.PRODUCTION */);
console.log("Compiling components...");
// returning a null should only ever happen during hot reloading in laggy conditions
var components = (await (0, compiler_ts_1.compileComponents)(1 /* CompileMode.PRODUCTION */));
// copy over assets
console.log("Copying assets...");
await (0, mod_ts_1.copy)("./assets", "./dist/assets", { overwrite: true });
await Deno.writeTextFile("./dist/index.html", content);
await Deno.writeTextFile("./dist/assets/components.js", components);
console.log("\nDone in ".concat(Math.round(performance.now() - startTime), "ms"));
