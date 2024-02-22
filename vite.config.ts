import glob from "glob";
import { basename, resolve } from "path";
import { defineConfig } from "vite";
import { glslify } from "vite-plugin-glslify";
import solid from "vite-plugin-solid";

export default defineConfig({
  base: "/shade-and-shape-examples/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        ...glob.sync(resolve(__dirname, "examples/*.html")).reduce(
          (inputs: Record<string, string>, p: string) => ({
            ...inputs,
            [basename(p).split(".")[0]]: p,
          }),
          {}
        ),
      },
    },
  },
  plugins: [solid(), glslify()],
});
