import { useCallback, useEffect, useRef } from 'react';

export type RefreshLifecycle = {
    readonly isValid: () => boolean;
};

export type RefreshPollingOptions<T> = {
    readonly refresh: (lifecycle: RefreshLifecycle) => Promise<T>;
    readonly commit: (value: T, lifecycle: RefreshLifecycle) => Promise<void> | void;
    readonly isResultValid?: (value: T) => boolean;
    readonly isEligible: () => boolean;
    readonly delay: number;
    readonly retryLimit: number;
    readonly onError: (error: unknown) => void;
};

export type RefreshPollingState = 'idle' | 'active-valid' | 'scheduled' | 'active-invalidated' | 'queued-rerun' | 'stopped-after-retries';

type RefreshPollingTraceEvent = 'request-started' | 'scheduled' | 'invalidated' | 'stopped-after-retries';

export type RefreshPollingController<T> = {
    readonly dispose: () => void;
    readonly getState: () => RefreshPollingState;
    readonly invalidate: () => void;
    readonly refreshNow: () => Promise<void>;
    readonly setEligible: (eligible: boolean) => Promise<void>;
    readonly updateOptions: (options: RefreshPollingOptions<T>) => void;
};

class CompletionScheduledRefresh<T> implements RefreshPollingController<T> {
    private active: Promise<void> | undefined;
    private disposed = false;
    private eligible = false;
    private failureCount = 0;
    private generation = 0;
    private queuedRerun = false;
    private state: RefreshPollingState = 'idle';
    private timer: ReturnType<typeof setTimeout> | undefined;

    constructor(private options: RefreshPollingOptions<T>) {}

    updateOptions(options: RefreshPollingOptions<T>): void {
        this.options = options;
    }

    getState(): RefreshPollingState {
        return this.state;
    }

    setEligible(eligible: boolean): Promise<void> {
        if (this.disposed) return Promise.resolve();
        if (!eligible) {
            this.invalidate();
            return this.active ?? Promise.resolve();
        }
        if (this.eligible) return this.active ?? Promise.resolve();

        this.eligible = true;
        this.failureCount = 0;
        if (this.active) {
            this.queuedRerun = true;
            this.state = 'queued-rerun';
            return this.active;
        }
        return this.start();
    }

    invalidate(): void {
        if (this.disposed) return;
        this.eligible = false;
        this.queuedRerun = false;
        this.generation += 1;
        this.clearTimer();
        this.state = this.active ? 'active-invalidated' : 'idle';
        this.traceLifecycle('invalidated');
    }

    refreshNow(): Promise<void> {
        this.clearTimer();
        if (this.disposed || !this.eligible || !this.options.isEligible()) return Promise.resolve();
        if (this.active) return this.active;

        this.failureCount = 0;
        return this.start();
    }

    dispose(): void {
        if (this.disposed) return;
        this.invalidate();
        this.disposed = true;
    }

    private start(): Promise<void> {
        const requestGeneration = this.generation;
        const { commit, isResultValid, refresh } = this.options;
        const lifecycle: RefreshLifecycle = {
            isValid: () => this.isCurrent(requestGeneration)
        };

        this.state = 'active-valid';
        this.traceLifecycle('request-started');
        const request = (async (): Promise<void> => {
            try {
                const value = await refresh(lifecycle);
                if (!lifecycle.isValid()) return;
                if (isResultValid && !isResultValid(value)) return;
                await commit(value, lifecycle);
                if (!lifecycle.isValid()) return;
                this.failureCount = 0;
                this.scheduleNext();
            } catch (error) {
                if (!lifecycle.isValid()) return;
                this.failureCount += 1;
                if (this.failureCount <= this.options.retryLimit) {
                    this.scheduleNext();
                } else {
                    this.state = 'stopped-after-retries';
                    this.traceLifecycle('stopped-after-retries');
                }
                throw error;
            } finally {
                this.active = undefined;
                if (this.queuedRerun && this.eligible && !this.disposed) {
                    this.queuedRerun = false;
                    this.startAutomatically();
                } else if (this.state === 'active-valid' || this.state === 'active-invalidated') {
                    this.state = 'idle';
                }
            }
        })();
        this.active = request;
        return request;
    }

    private isCurrent(requestGeneration: number): boolean {
        return !this.disposed && this.eligible && this.generation === requestGeneration && this.options.isEligible();
    }

    private scheduleNext(): void {
        this.clearTimer();
        if (!this.eligible || this.disposed || !this.options.isEligible()) return;

        this.state = 'scheduled';
        this.traceLifecycle('scheduled');
        this.timer = setTimeout(() => {
            this.timer = undefined;
            this.startAutomatically();
        }, this.options.delay);
    }

    private startAutomatically(): void {
        if (!this.eligible || this.disposed || !this.options.isEligible()) {
            this.state = 'idle';
            return;
        }
        void this.start().catch((error: unknown) => this.options.onError(error));
    }

    private clearTimer(): void {
        if (this.timer === undefined) return;
        clearTimeout(this.timer);
        this.timer = undefined;
    }

    private traceLifecycle(event: RefreshPollingTraceEvent): void {
        if (typeof __DEV__ !== 'boolean' || !__DEV__) return;
        // eslint-disable-next-line no-console
        console.log('[RefreshPolling]', { event, delayMs: this.options.delay });
    }
}

export const createRefreshPollingController = <T>(options: RefreshPollingOptions<T>): RefreshPollingController<T> =>
    new CompletionScheduledRefresh(options);

export const useRefreshPolling = <T>(options: RefreshPollingOptions<T>): (() => Promise<void>) => {
    const controllerRef = useRef<RefreshPollingController<T> | undefined>(undefined);
    if (controllerRef.current === undefined) controllerRef.current = createRefreshPollingController(options);
    const controller = controllerRef.current;
    controller.updateOptions(options);

    useEffect(() => {
        void controller.setEligible(options.isEligible()).catch(options.onError);
    }, [controller, options.isEligible, options.onError]);

    useEffect(() => () => controller.dispose(), [controller]);

    return useCallback(() => controller.refreshNow(), [controller]);
};
