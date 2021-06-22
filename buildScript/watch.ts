import { build } from "esbuild";
import { buildOptions } from "./buildOptoins";

build({
  ...buildOptions,
  watch: true,
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
