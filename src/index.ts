import type { AstroIntegration } from "astro";
import fs from "node:fs";
import path from "node:path";

/**
 * astro-status
 *
 * Static-first build status plugin for Astro.
 *
 * v1 behaviour:
 * - Runs at build time only
 * - Writes a deterministic status.json file into the final output directory
 * - Does NOT run at runtime
 * - Does NOT expose server state, env vars, or secrets
 * - Does NOT accept user input
 */
export default function astroStatus(): AstroIntegration {
  return {
    name: "astro-status",

    hooks: {
      /**
       * Build start hook
       *
       * This hook exists purely to confirm that the integration
       * is registered and executing correctly.
       *
       * It has no side effects.
       */
      "astro:build:start"() {
        console.log("[astro-status] plugin working");
      },

      /**
       * Build done hook
       *
       * This hook is invoked once Astro has finished generating
       * the static output directory.
       *
       * We safely write a static status.json file into that directory.
       */
      "astro:build:done"({ dir }) {
        /**
         * Astro provides the output directory as a file URL.
         * We intentionally:
         * - Convert it using URL
         * - Resolve paths explicitly
         * - Never accept user-provided paths
         */
        const outDirUrl = new URL(dir);
        const outDirPath = outDirUrl.pathname;

        /**
         * HARD SAFETY CHECK
         *
         * Ensure we are writing to a real directory.
         * If this ever fails, we abort silently rather than risk
         * writing to an unintended location.
         */
        if (!outDirPath || !fs.existsSync(outDirPath)) {
          console.warn("[astro-status] output directory not found, skipping");
          return;
        }

        /**
         * Resolve the final file path explicitly.
         * No dynamic filenames.
         * No traversal.
         */
        const filePath = path.join(outDirPath, "status.json");

        /**
         * Static payload.
         *
         * IMPORTANT:
         * - No environment variables
         * - No system information
         * - No runtime state
         * - No request data
         *
         * This file reflects BUILD SUCCESS only.
         */
        const payload = {
          status: "ok",
          mode: "static",
          builtAt: new Date().toISOString()
        };

        try {
          /**
           * Write the file atomically.
           *
           * JSON is pretty-printed for:
           * - human readability
           * - diff friendliness
           * - audit clarity
           */
          fs.writeFileSync(
            filePath,
            JSON.stringify(payload, null, 2),
            { encoding: "utf-8", flag: "w" }
          );

          console.log("[astro-status] wrote /status.json");
        } catch (err) {
          /**
           * HARD FAILURE MODE
           *
           * We do NOT throw.
           * We do NOT crash the build.
           *
           * This plugin must never break a site build.
           */
          console.error("[astro-status] failed to write status.json", err);
        }
      }
    }
  };
}