// `npm run dev`: plain Next dev server (kept as a script so the port/args pass through).
import { spawn } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const next = spawn(process.execPath, [join(root, "node_modules", "next", "dist", "bin", "next"), "dev", ...process.argv.slice(2)], { cwd: root, stdio: "inherit" });
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => next.kill());
next.on("exit", (code) => process.exit(code ?? 0));
