import * as esbuild from "https://deno.land/x/esbuild@v0.17.19/mod.js";

export const enum CompileMode {
    DEVELOPMENT,
    PRODUCTION
}

let context: esbuild.BuildContext | undefined = undefined;

function makeESBuildOptions(mode: CompileMode) {
    return {
        entryPoints: ["./components/index.ts"],
        outdir: "./components/build",
        bundle: true,
        minify: mode == CompileMode.PRODUCTION,
        sourcemap: mode == CompileMode.DEVELOPMENT ? "inline" as const : false,
        target: [
            "es2021",
            "chrome110",
            "firefox110",
            "safari16",
        ],
        logLevel: mode == CompileMode.PRODUCTION ? "info" as const : "warning" as const,
    }
}

export async function compileComponents(mode: CompileMode) {
    const startTime = performance.now();

    if (mode == CompileMode.DEVELOPMENT) {
        // use the Context API to keep the ESBuild instance
        if (!context) {
            context = await esbuild.context(makeESBuildOptions(mode));
        }

        context.rebuild();

        console.log(`Compiled components in ${Math.round(performance.now() - startTime)}ms`);
    } else {
        // just build it
        await esbuild.build(makeESBuildOptions(mode));
        esbuild.stop();
    }

    return await Deno.readTextFile("./components/build/index.js");
}

const devScript = `
<script>
const ws = new WebSocket("ws://localhost:8080/reload");
ws.addEventListener("message", (event) => {
    window.location.reload();
});
</script>
`;

export async function compileContent(mode: CompileMode) {
    const template = await Deno.readTextFile("./template.html");
    const content = await Deno.readTextFile("./content.html");

    let result = template.replace("#slot#", content);
    if (mode == CompileMode.DEVELOPMENT) {
        result = result.replace("#dev-script#", devScript);
    } else {
        result = result.replace("#dev-script#", "");
    }
    return result;
}