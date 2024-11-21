import { describe, expect, it } from 'vitest';
import {
  createExecutionContext,
  env,
  waitOnExecutionContext,
} from 'cloudflare:test';
import worker from './worker';

declare module 'cloudflare:test' {
  interface ProvidedEnv {
    ENVIRONMENT: string;
  }
}

env.ENVIRONMENT = 'test';

describe('worker', () => {
  it('should work', async () => {
    const request = new Request('http://localhost');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);

    const responseText = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/html; charset=UTF-8');
    expect(responseText).toContain('<html><body>');
    expect(responseText).toContain('test');
  });
});
