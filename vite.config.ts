import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  base: "/shade-and-shape-examples/",
  plugins: [solid()],
});
