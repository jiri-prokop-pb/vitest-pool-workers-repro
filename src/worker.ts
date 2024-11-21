import { Hono } from 'hono';
import { env } from 'hono/adapter';

const app = new Hono<{ Bindings: Bindings }>();

export type Bindings = {
  ENVIRONMENT: string;
};

// QUESTION: what's a proper way to have `caches.default` available?
declare global {
  interface CacheStorage {
    readonly default: Cache;
  }
}

app.get('*', async ctx => {
  const { ENVIRONMENT } = env(ctx);

  const cache = caches.default;
  const cacheKey = new Request(ctx.req.url);
  let response = await cache.match(cacheKey);

  if (!response) {
    response = ctx.html(`<html><body><font>${ENVIRONMENT}</font></body></html>`);

    ctx.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));
  } else {
    response = new Response(response.body, response);
  }

  return new HTMLRewriter()
    .on(
      `font`,
      new HTMLRewriterHandler()
    )
    .transform(response);
});

export class HTMLRewriterHandler {
  element(element: Element) {
    element.setAttribute('style', 'color: red; font-weight: bold;');
  }
}

export default app;
