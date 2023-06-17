import { Application } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { compileComponents, compileContent, CompileMode } from "./compiler.ts";

const specialRoutes = {
    ["/"]: { content: await compileContent(CompileMode.DEVELOPMENT), type: "text/html" },
    ["/assets/components.js"]: { content: await compileComponents(CompileMode.DEVELOPMENT), type: "application/javascript" },
};


const websockets = new Map<string, WebSocket>();

// use the websocket connections to reload the clients
function reloadClients() {
    console.log("reloading");
    websockets.forEach((socket) => socket.send("reload pls"));
}

// watch on all the special routes
function watchUpdates() {
    let lastRefresh = performance.now();

    // content
    (async () => {
        const contentWatcher = Deno.watchFs(["./template.html", "./content.html"]);
        for await (const _event of contentWatcher) {
            if (performance.now() - lastRefresh < 150) {
                continue;
            }
            lastRefresh = performance.now();
            specialRoutes["/"].content = await compileContent(CompileMode.DEVELOPMENT);
            console.log(`content reload took ${Math.round(performance.now() - lastRefresh)}ms`);
            reloadClients();
        }
    })();

    // components
    (async () => {
        const componentsWatcher = Deno.watchFs(["./components/"]);
        for await (const event of componentsWatcher) {
            // check if the event is about the esbuild output file
            // (we do not want to recurse forever)
            // also, remove events should always invoke a rebuild (for example, if the esbuild output is removed)
            if (event.kind != "remove") {
                const indexPath = await Deno.realPath("./components/build/index.js");
                const paths = await Promise.all(event.paths.map((path) => Deno.realPath(path)))
                if (paths.some((path) => path == indexPath)) {
                    continue;
                }
            }
            if (performance.now() - lastRefresh < 150) {
                continue;
            }
            lastRefresh = performance.now();
            specialRoutes["/assets/components.js"].content = await compileComponents(CompileMode.DEVELOPMENT);
            console.log(`component reload took ${Math.round(performance.now() - lastRefresh)}ms`);
            reloadClients();
        }
    })();

    // assets
    (async () => {
        const assetsWatcher = Deno.watchFs(["./assets/"]);
        for await (const _event of assetsWatcher) {
            if (performance.now() - lastRefresh < 150) {
                continue;
            }
            lastRefresh = performance.now();
            // assets are not processed in any way during dev
            reloadClients();
        }
    })();
}

watchUpdates();


const app = new Application();

app.use(async (ctx) => {
    const path = ctx.request.url.pathname;
    if (path in specialRoutes) {
        const route = specialRoutes[path as keyof typeof specialRoutes];
        ctx.response.body = route.content;
        ctx.response.type = route.type;
    } else if (path == "/reload") {
        const socket = ctx.upgrade();
        const id = Math.floor(Math.random() * 0xffffffff).toString(16);
        websockets.set(id, socket);
        console.log(`ws ID ${id} opened`);
        socket.addEventListener("close", () => {
            console.log(`ws ID ${id} closed`);
            websockets.delete(id);
        });
    } else if (path.startsWith("/assets/")) {
        await ctx.send({
            root: Deno.cwd(),
        });
    }
});

console.log("Open on http://localhost:8080/")

await app.listen({
    port: 8080,
});
