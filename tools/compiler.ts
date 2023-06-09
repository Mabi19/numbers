import * as esbuild from "https://deno.land/x/esbuild@v0.17.19/mod.js";

export const enum CompileMode {
    DEVELOPMENT,
    PRODUCTION
}

let context: esbuild.BuildContext | undefined = undefined;

export async function compileComponents(mode: CompileMode) {
    const startTime = performance.now();

    if (!context) {
        context = await esbuild.context({
            entryPoints: ["./components/index.ts"],
            outdir: "./components/build",
            bundle: true,
            minify: mode == CompileMode.PRODUCTION,
            sourcemap: mode == CompileMode.DEVELOPMENT ? "inline" : false,
            target: [
                "es2021",
                "chrome110",
                "firefox110",
                "safari16",
            ],
            logLevel: mode == CompileMode.PRODUCTION ? "info" : "warning",
        });
    }

    context.rebuild();

    if (mode == CompileMode.DEVELOPMENT) {
        console.log(`Compiled components in ${Math.round(performance.now() - startTime)}ms`);
    }

    if (mode == CompileMode.PRODUCTION) {
        context.dispose();
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