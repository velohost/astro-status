# astro-status

**Static-first site status endpoint for Astro**

`astro-status` is a tiny Astro integration that generates a machine-readable
`/status.json` file at build time. It is designed to be honest, deterministic,
and safe for fully static sites.

This plugin answers one simple question:

> *Did this site build successfully, and when?*

It does **not** pretend to be a live health check.

---

## Why this exists

Many sites want a simple status endpoint, but:

- Static sites cannot truthfully report runtime health
- Existing solutions fake liveness
- Tooling often scrapes HTML instead of reading a clear signal

`astro-status` solves this by exposing **build status**, not server state.

---

## What it does (v1)

On `astro build`, the plugin writes a file:

```
/status.json
```

With contents like:

```json
{
  "status": "ok",
  "mode": "static",
  "builtAt": "2026-01-08T18:22:36.962Z"
}
```

This file is:

- Static
- Cache-safe
- Deterministic
- Machine-readable
- Honest about what it represents

---

## What it does NOT do

This plugin deliberately does **not**:

- Act as a runtime health check
- Execute on every request
- Read environment variables
- Expose system information
- Track users
- Require cookies
- Require Cloudflare Workers or edge functions

If you need runtime liveness, that is a **v2 concern** and requires SSR or edge support.

---

## Installation

```bash
npm install astro-status
```

Or during development:

```bash
npm link astro-status
```

---

## Usage

Add the integration to your `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import astroStatus from "astro-status";

export default defineConfig({
  integrations: [
    astroStatus()
  ]
});
```

That’s it.

On build, `/status.json` will be written to your output directory.

---

## Static-first by design

`astro-status` detects Astro’s output mode automatically.

In **static mode**:
- Writes a build-time status file
- Reflects build success only

In **future versions (v2)**:
- Hybrid and server output may enable runtime endpoints

v1 makes **no false claims** about liveness.

---

## Cloudflare & CDN compatibility

This plugin works perfectly behind:

- Cloudflare proxy
- Netlify
- Vercel
- S3 / static hosting
- Any CDN

Because the output is static:
- It can be cached indefinitely
- It is safe to monitor
- It will never cause cache fragmentation

---

## Security & hardening

This plugin is intentionally low-risk:

- No user input
- No request handling
- No filesystem reads
- No dynamic paths
- No secrets

If the status file cannot be written, the build continues safely.

---

## Roadmap

Planned for v2 (not in v1):

- Runtime `/status` endpoint (SSR / hybrid)
- Optional text format (`/status.txt`)
- Optional site metadata
- Explicit health vs build distinction

v1 is intentionally minimal.

---

## License

MIT

---

## Philosophy

> Static sites should not lie about being dynamic.

`astro-status` prefers correctness and transparency over convenience.

---

## Related plugins

You may also like:

- `astro-http` — deterministic HTTP headers
- `astro-security` — RFC 9116 `security.txt`
- `astro-canonical` — canonical URL enforcement
- `astro-indexnow` — IndexNow submission on build

---

## Author

Built as part of the Velohost Astro plugin suite.
