import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";

let config = { port: 2000 };

const file = Bun.file("config.json");

if (await file.exists()) {
	try {
		const tmp = await file.json();
		if (Number.isInteger(tmp.port)) {
			config.port = tmp.port;
		}
	} catch (err) {
		console.error("Config file error: " + err);
	}
}

const app = new Hono();

app.use("*", logger());
app.use("/*", serveStatic({ root: "./public/" }));

await Bun.build({
	entrypoints: ["./public/index.ts"],
	outdir: "./public",
	// minify: true,
	// minify: {
	// 	identifiers: false, // default: false
	// 	whitespace: true, // default: false
	// 	syntax: true, // default: false
	// },
});

export default {
	port: config.port,
	fetch: app.fetch,
};
