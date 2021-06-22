import { build } from "esbuild";
import { buildOptions } from "./buildOptoins";

build(buildOptions).catch((error) => {
  console.error(error);
  process.exit(1);
});
