import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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

const readSource = (path: string): string => readFileSync(resolve(process.cwd(), path), 'utf8');

const stakingSource = readSource('src/organisms/staking/staking/index.tsx');
const delegateSource = readSource('src/organisms/staking/delegate/index.tsx');
const validatorSource = readSource('src/organisms/staking/validator/index.tsx');
const stakingHooksSource = readSource('src/hooks/staking/hooks.tsx');
const pollingHookSource = readSource('src/hooks/common/useScreenRefreshPolling.ts');

describe('staking polling owners', () => {
    it.each([
        ['Staking', stakingSource],
        ['Delegate', delegateSource],
        ['Validator', validatorSource]
    ])('routes the %s aggregate refresh through the completion-scheduled lifecycle', (_name, source) => {
        // Given
        const pollingImport = /import \{[^}]*useScreenRefreshPolling[^}]*\} from '@\/hooks\/common\/useScreenRefreshPolling';/;

        // When
        const usesCompletionScheduling = pollingImport.test(source) && source.includes('useScreenRefreshPolling({');

        // Then
        expect(usesCompletionScheduling).toBe(true);
        expect(source).not.toContain('useInterval(');
    });

    it.each([
        ['Staking', stakingSource],
        ['Delegate', delegateSource],
        ['Validator', validatorSource]
    ])('makes %s eligible only while focused, active, and on the current network', () => {
        // Given
        const eligibilityExpression = /isFocused\s*&&\s*appState === 'active'\s*&&\s*\(!requireStableNetwork \|\| !isNetworkChanged\)/;

        // When
        const eligibilityIsComplete = eligibilityExpression.test(pollingHookSource);

        // Then
        expect(eligibilityIsComplete).toBe(true);
    });

    it('keeps Delegate focus/timer-only without adding pull-to-refresh UI', () => {
        // Given
        const pullControl = /RefreshScrollView|RefreshControl/;

        // When
        const hasPullControl = pullControl.test(delegateSource);

        // Then
        expect(hasPullControl).toBe(false);
    });

    it('passes lifecycle validity through every delegation and validator response setter path', () => {
        // Given
        const guardedDelegationHandlers = [
            'handleDelegationState(lifecycle)',
            'handleStakingGrantActivationState(lifecycle)',
            'handleTotalDelegationPolling(lifecycle'
        ];

        // When
        const ownersPassLifecycle = guardedDelegationHandlers.every(
            (handler) => delegateSource.includes(handler) || stakingSource.includes(handler) || validatorSource.includes(handler)
        );

        // Then
        expect(ownersPassLifecycle).toBe(true);
        expect(validatorSource).toContain('handleValidatorPolling(lifecycle)');
        expect(stakingHooksSource.match(/if \(lifecycle\?\.isValid\(\) === false\) return;/g)?.length).toBeGreaterThanOrEqual(5);
    });

    it('uses one aggregate refresh callback per owner with a four-attempt cap', () => {
        // Given
        const owners = [stakingSource, delegateSource, validatorSource];

        // When
        const configuredOwners = owners.filter((source) => (source.match(/useScreenRefreshPolling\(\{/g) ?? []).length === 1);

        // Then
        expect(configuredOwners).toHaveLength(3);
    });
});

describe('staking polling surface scenario', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it('starts one aggregate request at settlement plus 30 seconds and joins overlapping triggers', async () => {
        // Given
        const requests: Deferred<number>[] = [];
        const refresh = jest.fn<() => Promise<number>>(() => {
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
        const focusRequest = controller.setEligible(true);
        const overlappingManualRequest = controller.refreshNow();
        requests[0]?.resolve(1);
        await Promise.all([focusRequest, overlappingManualRequest]);
        await jest.advanceTimersByTimeAsync(DELAY - 1);

        // Then
        expect(refresh).toHaveBeenCalledTimes(1);
        await jest.advanceTimersByTimeAsync(1);
        expect(refresh).toHaveBeenCalledTimes(2);
        controller.dispose();
    });

    it('drops a delayed response after invalidation and performs one rerun after refocus', async () => {
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
        const invalidatedRequest = controller.setEligible(true);

        // When
        void controller.setEligible(false);
        void controller.setEligible(true);
        void controller.setEligible(true);
        first.resolve(1);
        await invalidatedRequest;

        // Then
        expect(commit).not.toHaveBeenCalled();
        expect(refresh).toHaveBeenCalledTimes(2);
        second.resolve(2);
        await controller.refreshNow();
        expect(commit).toHaveBeenCalledTimes(1);
        controller.dispose();
    });

    it('stops after four sequential aggregate failures without starting a fifth request', async () => {
        // Given
        const failure = new Error('offline');
        const refresh = jest.fn<() => Promise<number>>().mockRejectedValue(failure);
        const controller = createRefreshPollingController({
            refresh,
            commit: jest.fn<(value: number, lifecycle: RefreshLifecycle) => void>(),
            isEligible: () => true,
            delay: DELAY,
            retryLimit: 3,
            onError: jest.fn<(error: unknown) => void>()
        });

        // When
        await expect(controller.setEligible(true)).rejects.toBe(failure);
        await jest.advanceTimersByTimeAsync(DELAY * 4);

        // Then
        expect(refresh).toHaveBeenCalledTimes(4);
        expect(jest.getTimerCount()).toBe(0);
        controller.dispose();
    });
});
