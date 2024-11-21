# Minimal reproduction example of vitest-pool-workers problem

This repository contains minimal reproduction example of problem that is most likely related to `vitest-pool-workers` or other part of Cloudflare's workers-sdk.

The problem is when using `HTMLRewriter` and `cache.defaults` together inside worker.

# Usage

Clone the repo and run:
```
pnpm install
```

You can test that worker works correctly by running:
```
pnpm wrangler dev
```
and accessing the page from your browser. You should see red bold "dev" text.

Then run:
```
pnpm vitest
```

The problem is that test will timeout after 5 seconds.

If the part with either `cache.put` or `return new HTMLRewriter()` is removed/replaced in the worker, the test will pass.
