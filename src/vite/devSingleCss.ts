import type { Plugin } from "vite";
import * as sass from "sass";

export default function convertScssToCss(): Plugin {
  const collectScss = new Map<string, string>();

  function compileScss(): string {
    if (!collectScss.size) {
      return "";
    }

    try {
      const result = sass.compileString(
        Array.from(collectScss.values()).join(""),
        {
          style: "compressed",
        },
      );
      return result.css;
    } catch (error) {
      console.error("Error compiling Scss", error);
      return "";
    }
  }

  return {
    name: "compile-scss-to-css",
    apply: "serve",

    configureServer(viteServer) {
      viteServer.middlewares.use((request, response, next) => {
        if (request.url === "/@dev-bundled-styles.css") {
          response.setHeader("Content-Type", "text.css");
          (response.statusCode = 200), response.end(compileScss());
          return;
        }
        next();
      });
    },
    transform(code: string, id: string) {
      if (id.endsWith(".scss")) {
        collectScss.set(id, code);
      }
      return code;
    },
    transformIndexHtml(html: string) {
      const linkTag = `\n <link rel="stylesheet" href="/@dev-bundled-styles.css">`;
      return html.replace("</head>", `${linkTag}\n</head>`);
    },
  };
}
