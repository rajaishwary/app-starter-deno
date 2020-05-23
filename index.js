import { Application } from "https://deno.land/x/oak/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import * as log from "https://deno.land/std/log/mod.ts";
import router from "./routes.js";

const { APP_HOST, APP_PORT } = config({ safe: true });
const app = new Application();

await log.setup({
    handlers: {
        console: new log.handlers.ConsoleHandler("DEBUG"),

        file: new log.handlers.FileHandler("WARNING", {
            filename: "./log.txt",
            formatter: "{levelName} {msg}",
        }),
    },

    loggers: {
        default: {
            level: "DEBUG",
            handlers: ["console", "file"],
        },

        tasks: {
            level: "ERROR",
            handlers: ["console"],
        },
    },
});

let logger;

logger = log.getLogger();
logger.debug("fizz");
logger.warning("buzz");

logger = log.getLogger("tasks");
logger.debug("fizz");
logger.error("buzz");

const unknownLogger = log.getLogger("mystery");
unknownLogger.info("foobar");

app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

app.use(router.routes());

console.log(`Listening on ${APP_HOST}:${APP_PORT}...`);

await app.listen(`${APP_HOST}:${APP_PORT}`);
