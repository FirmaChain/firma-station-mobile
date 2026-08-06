import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { createRefreshPollingController, type RefreshLifecycle } from '@/hooks/common/useRefreshPolling';

const DELAY = 30_000;

type Deferred<T> = {
    readonly promise: Promise<T>;
    readonly reject: (reason: Error) => void;
    readonly resolve: (value: T) => void;
};

const deferred = <T>(): Deferred<T> => {
    let rejectPromise: (reason: Error) => void = () => undefined;
    let resolvePromise: (value: T) => void = () => undefined;
    const promise = new Promise<T>((resolve, reject) => {
        rejectPromise = reject;
        resolvePromise = resolve;
    });
    return { promise, reject: rejectPromise, resolve: resolvePromise };
};

describe('completion-scheduled refresh lifecycle', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.spyOn(console, 'log').mockImplementation(() => undefined);
    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.useRealTimers();
    });

    it('emits development lifecycle events for a completed refresh and its scheduled follow-up', async () => {
        // Given
        // eslint-disable-next-line no-console
        const trace = jest.mocked(console.log);
        const refresh = jest.fn<() => Promise<number>>().mockResolvedValue(1);
        const controller = createRefreshPollingController({
            refresh,
            commit: jest.fn<(value: number, lifecycle: RefreshLifecycle) => void>(),
            isEligible: () => true,
            delay: DELAY,
            retryLimit: 3,
            onError: jest.fn<(error: unknown) => void>()
        });

        // When
        await controller.setEligible(true);
        await jest.advanceTimersByTimeAsync(DELAY);

        // Then
        expect(trace).toHaveBeenNthCalledWith(1, '[RefreshPolling]', { event: 'request-started', delayMs: DELAY });
        expect(trace).toHaveBeenNthCalledWith(2, '[RefreshPolling]', { event: 'scheduled', delayMs: DELAY });
        expect(trace).toHaveBeenNthCalledWith(3, '[RefreshPolling]', { event: 'request-started', delayMs: DELAY });
        controller.dispose();
    });

    it('schedules the next automatic refresh exactly one delay after a valid success settles', async () => {
        // Given
        const requests: Deferred<number>[] = [];
        const refresh = jest.fn<(lifecycle: RefreshLifecycle) => Promise<number>>(() => {
            const request = deferred<number>();
            requests.push(request);
            return request.promise;
        });
        const controller = createRefreshPollingController({
            refresh,
            commit: jest.fn<(value: number, lifecycle: RefreshLifecycle) => void>(),
            isEligible: () => true,
            delay: DELAY,
            retryLimit: 3,
            onError: jest.fn<(error: unknown) => void>()
        });

        // When
        const initial = controller.setEligible(true);

        // Then
        expect(refresh).toHaveBeenCalledTimes(1);
        expect(jest.getTimerCount()).toBe(0);
        requests[0]?.resolve(1);
        await initial;
        expect(jest.getTimerCount()).toBe(1);
        await jest.advanceTimersByTimeAsync(DELAY - 1);
        expect(refresh).toHaveBeenCalledTimes(1);
        await jest.advanceTimersByTimeAsync(1);
        expect(refresh).toHaveBeenCalledTimes(2);
        controller.dispose();
    });

    it('restarts the full delay after a manual refresh succeeds during a scheduled wait', async () => {
        // Given
        const refresh = jest.fn<() => Promise<number>>().mockResolvedValue(1);
        const controller = createRefreshPollingController({
            refresh,
            commit: jest.fn<(value: number, lifecycle: RefreshLifecycle) => void>(),
            isEligible: () => true,
            delay: DELAY,
            retryLimit: 3,
            onError: jest.fn<(error: unknown) => void>()
        });
        await controller.setEligible(true);
        await jest.advanceTimersByTimeAsync(10_000);

        // When
        await controller.refreshNow();

        // Then
        expect(refresh).toHaveBeenCalledTimes(2);
        await jest.advanceTimersByTimeAsync(DELAY - 1);
        expect(refresh).toHaveBeenCalledTimes(2);
        await jest.advanceTimersByTimeAsync(1);
        expect(refresh).toHaveBeenCalledTimes(3);
        controller.dispose();
    });

    it('joins an active automatic request when manual refreshes overlap it', async () => {
        // Given
        const automatic = deferred<number>();
        const refresh = jest.fn<() => Promise<number>>().mockResolvedValueOnce(1).mockReturnValueOnce(automatic.promise);
        const controller = createRefreshPollingController({
            refresh,
            commit: jest.fn<(value: number, lifecycle: RefreshLifecycle) => void>(),
            isEligible: () => true,
            delay: DELAY,
            retryLimit: 3,
            onError: jest.fn<(error: unknown) => void>()
        });
        await controller.setEligible(true);
        await jest.advanceTimersByTimeAsync(DELAY);

        // When
        const firstManual = controller.refreshNow();
        const secondManual = controller.refreshNow();

        // Then
        expect(refresh).toHaveBeenCalledTimes(2);
        automatic.resolve(2);
        await expect(Promise.all([firstManual, secondManual])).resolves.toEqual([undefined, undefined]);
        expect(jest.getTimerCount()).toBe(1);
        controller.dispose();
    });

    it('blocks an invalid result and queues only one immediate rerun after refocus', async () => {
        // Given
        const first = deferred<number>();
        const second = deferred<number>();
        const commit = jest.fn<(value: number, lifecycle: RefreshLifecycle) => void>();
        const refresh = jest.fn<() => Promise<number>>().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
        const controller = createRefreshPollingController({
            refresh,
            commit,
            isEligible: () => true,
            delay: DELAY,
            retryLimit: 3,
            onError: jest.fn<(error: unknown) => void>()
        });
        const invalidated = controller.setEligible(true);

        // When
        controller.setEligible(false);
        controller.setEligible(true);
        controller.setEligible(true);
        first.resolve(1);
        await invalidated;

        // Then
        expect(commit).not.toHaveBeenCalled();
        expect(refresh).toHaveBeenCalledTimes(2);
        expect(jest.getTimerCount()).toBe(0);
        second.resolve(2);
        await controller.refreshNow();
        expect(commit).toHaveBeenCalledTimes(1);
        expect(commit).toHaveBeenCalledWith(2, expect.objectContaining({ isValid: expect.any(Function) }));
        expect(jest.getTimerCount()).toBe(1);
        controller.dispose();
    });

    it('clears scheduled work and ignores stale failures while ineligible', async () => {
        // Given
        const pending = deferred<number>();
        const commit = jest.fn<(value: number, lifecycle: RefreshLifecycle) => void>();
        const onError = jest.fn<(error: unknown) => void>();
        const controller = createRefreshPollingController({
            refresh: () => pending.promise,
            commit,
            isEligible: () => false,
            delay: DELAY,
            retryLimit: 3,
            onError
        });
        const initial = controller.setEligible(true);

        // When
        controller.invalidate();
        pending.reject(new Error('stale failure'));
        await expect(initial).resolves.toBeUndefined();

        // Then
        expect(commit).not.toHaveBeenCalled();
        expect(onError).not.toHaveBeenCalled();
        expect(jest.getTimerCount()).toBe(0);
        controller.dispose();
    });

    it('does not commit or schedule when a settled result is invalid', async () => {
        // Given
        const commit = jest.fn<(value: number, lifecycle: RefreshLifecycle) => void>();
        const controller = createRefreshPollingController({
            refresh: jest.fn<() => Promise<number>>().mockResolvedValue(0),
            commit,
            isResultValid: (value) => value > 0,
            isEligible: () => true,
            delay: DELAY,
            retryLimit: 3,
            onError: jest.fn<(error: unknown) => void>()
        });

        // When
        await controller.setEligible(true);

        // Then
        expect(commit).not.toHaveBeenCalled();
        expect(jest.getTimerCount()).toBe(0);
        controller.dispose();
    });

    it('stops after the initial failure and exactly three delayed retries', async () => {
        // Given
        const failure = new Error('offline');
        const refresh = jest.fn<() => Promise<number>>().mockRejectedValue(failure);
        const onError = jest.fn<(error: unknown) => void>();
        const controller = createRefreshPollingController({
            refresh,
            commit: jest.fn<(value: number, lifecycle: RefreshLifecycle) => void>(),
            isEligible: () => true,
            delay: DELAY,
            retryLimit: 3,
            onError
        });

        // When
        await expect(controller.setEligible(true)).rejects.toBe(failure);
        await jest.advanceTimersByTimeAsync(DELAY * 4);

        // Then
        expect(refresh).toHaveBeenCalledTimes(4);
        expect(onError).toHaveBeenCalledTimes(3);
        expect(jest.getTimerCount()).toBe(0);
        expect(controller.getState()).toBe('stopped-after-retries');
        controller.dispose();
    });

    it('resets the failure budget after any valid success', async () => {
        // Given
        const failure = new Error('offline');
        const refresh = jest.fn<() => Promise<number>>().mockRejectedValueOnce(failure).mockResolvedValueOnce(1).mockRejectedValue(failure);
        const controller = createRefreshPollingController({
            refresh,
            commit: jest.fn<(value: number, lifecycle: RefreshLifecycle) => void>(),
            isEligible: () => true,
            delay: DELAY,
            retryLimit: 3,
            onError: jest.fn<(error: unknown) => void>()
        });
        await expect(controller.setEligible(true)).rejects.toBe(failure);
        await jest.advanceTimersByTimeAsync(DELAY);

        // When
        await jest.advanceTimersByTimeAsync(DELAY * 5);

        // Then
        expect(refresh).toHaveBeenCalledTimes(6);
        expect(jest.getTimerCount()).toBe(0);
        controller.dispose();
    });

    it('counts a rejected request joined by repeated manual triggers only once', async () => {
        // Given
        const failure = new Error('offline');
        const active = deferred<number>();
        const refresh = jest
            .fn<() => Promise<number>>()
            .mockResolvedValueOnce(1)
            .mockReturnValueOnce(active.promise)
            .mockRejectedValue(failure);
        const controller = createRefreshPollingController({
            refresh,
            commit: jest.fn<(value: number, lifecycle: RefreshLifecycle) => void>(),
            isEligible: () => true,
            delay: DELAY,
            retryLimit: 3,
            onError: jest.fn<(error: unknown) => void>()
        });
        await controller.setEligible(true);
        await jest.advanceTimersByTimeAsync(DELAY);
        const manual = controller.refreshNow();
        const repeatedManual = controller.refreshNow();

        // When
        active.reject(failure);
        await expect(manual).rejects.toBe(failure);
        await expect(repeatedManual).rejects.toBe(failure);
        await jest.advanceTimersByTimeAsync(DELAY * 4);

        // Then
        expect(refresh).toHaveBeenCalledTimes(5);
        expect(jest.getTimerCount()).toBe(0);
        controller.dispose();
    });
});
