import { createServer, type Server } from 'node:http';

import { ApiClient } from '@/util/apiClient';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

describe('ApiClient compatibility contract', () => {
    let server: Server;
    let baseUrl: string;
    let retryRequests = 0;

    beforeAll(async () => {
        server = createServer((request, response) => {
            switch (request.url) {
                case '/success':
                    response.writeHead(200, { 'content-type': 'application/json' });
                    response.end(JSON.stringify({ ok: true }));
                    return;
                case '/http-failure':
                    response.writeHead(503, { 'content-type': 'application/json' });
                    response.end(JSON.stringify({ error: 'unavailable' }));
                    return;
                case '/invalid-json':
                    response.writeHead(200, { 'content-type': 'application/json' });
                    response.end('{');
                    return;
                case '/retry':
                    retryRequests += 1;
                    if (retryRequests === 1) {
                        response.writeHead(503, { 'content-type': 'application/json' });
                        response.end(JSON.stringify({ error: 'retry me' }));
                        return;
                    }
                    response.writeHead(200, { 'content-type': 'application/json' });
                    response.end(JSON.stringify({ retried: true }));
                    return;
                default:
                    response.writeHead(404);
                    response.end();
            }
        });

        await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
        const address = server.address();
        if (address === null || typeof address === 'string') throw new Error('Expected a TCP test server address.');
        baseUrl = `http://127.0.0.1:${address.port}`;
    });

    afterAll(async () => {
        await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    });

    it('returns parsed JSON when a local request succeeds', async () => {
        const client = new ApiClient({ baseUrl });

        await expect(client.getJson<{ readonly ok: boolean }>('/success')).resolves.toEqual({ ok: true });
    });

    it('maps an HTTP failure to an HTTP ApiError', async () => {
        const client = new ApiClient({ baseUrl });

        await expect(client.getJson('/http-failure')).rejects.toMatchObject({
            kind: 'http',
            status: 503,
            message: 'The server returned HTTP 503.'
        });
    });

    it('maps invalid JSON to a parse ApiError', async () => {
        const client = new ApiClient({ baseUrl });

        await expect(client.getJson('/invalid-json')).rejects.toMatchObject({
            kind: 'parse',
            message: 'The server returned invalid JSON.'
        });
    });

    it('maps a local network failure to a network ApiError', async () => {
        const client = new ApiClient({ baseUrl: 'http://127.0.0.1:0' });

        await expect(client.getJson('/unreachable')).rejects.toMatchObject({ kind: 'network' });
    });

    it('maps cancellation to a network ApiError', async () => {
        const controller = new AbortController();
        controller.abort();
        const client = new ApiClient({ baseUrl });

        await expect(client.getJson('/success', { signal: controller.signal })).rejects.toMatchObject({ kind: 'network' });
    });

    it('retries a retryable local HTTP failure when the request enables retry', async () => {
        retryRequests = 0;
        const client = new ApiClient({ baseUrl });

        await expect(client.getJson<{ readonly retried: boolean }>('/retry', { retry: { limit: 1 } })).resolves.toEqual({
            retried: true
        });
        expect(retryRequests).toBe(2);
    });

    it('does not start or end progress when the request disables progress', async () => {
        const progress = { begin: jest.fn<() => string>(() => 'request-1'), end: jest.fn<(requestId: string) => void>() };
        const client = new ApiClient({ baseUrl, progress });

        await expect(client.getJson('/success', { context: { disableProgress: true } })).resolves.toEqual({ ok: true });
        expect(progress.begin).not.toHaveBeenCalled();
        expect(progress.end).not.toHaveBeenCalled();
    });
});
