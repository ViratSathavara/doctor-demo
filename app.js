/* eslint-disable @typescript-eslint/no-require-imports -- Node startup file for CommonJS hosting environments. */

// Run `npm run build` before starting this file in production.
process.env.NODE_ENV ??= "production";

const { createServer } = require("node:http");
const next = require("next");

const port = Number(process.env.PORT || 3000);
const hostname = process.env.HOST || "0.0.0.0";
const dev = process.env.NODE_ENV === "development";

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}

const app = next({ dev, dir: __dirname, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res).catch((error) => {
      console.error("Request failed:", error);
      if (!res.headersSent) res.statusCode = 500;
      if (!res.writableEnded) res.end("Internal Server Error");
    });
  });

  server.on("upgrade", (req, socket, head) => {
    app.getUpgradeHandler()(req, socket, head).catch((error) => {
      console.error("Connection upgrade failed:", error);
      socket.destroy();
    });
  });

  server.on("error", (error) => {
    console.error("Unable to start the server:", error);
    process.exit(1);
  });

  server.listen(port, hostname, () => {
    console.log(`Server listening on ${hostname}:${port} (${dev ? "development" : "production"})`);
  });
}).catch((error) => {
  console.error("Unable to prepare Next.js:", error);
  process.exit(1);
});
