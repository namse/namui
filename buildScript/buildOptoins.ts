import { build, BuildOptions } from "esbuild";
import dotenv from "dotenv";
import fs from "fs";

const define: { [key: string]: string } = {};

const envConfig = dotenv.parse(fs.readFileSync(".env"));
for (const k in envConfig) {
  define[`process.env.${k}`] = `"${envConfig[k]}"`;
}

export const buildOptions: BuildOptions = {
  entryPoints: ["./index.ts"],
  outfile: "./build/bundle.js",
  bundle: true,
  define,
  sourcemap: true,
  logLevel: "info",
  minify: true,
};
