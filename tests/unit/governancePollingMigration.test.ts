import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { createRefreshPollingController, type RefreshLifecycle } from '@/hooks/common/useRefreshPolling';

const DELAY = 30_000;

type Deferred<T> = {
    readonly promise: Promise<T>;
    readonly resolve: (value: T) => void;
};

const deferred = <T>(): Deferred<T> => {
    let resolvePromise: (value: T) => void = () => undefined;
    const promise = new Promise<T>((resolvePromiseValue) => {
        resolvePromise = resolvePromiseValue;
    });
    return { promise, resolve: resolvePromise };
};

const readSource = (path: string): string => readFileSync(resolve(process.cwd(), path), 'utf8');

const governanceSource = readSource('src/organisms/governance/governance/index.tsx');
const proposalSource = readSource('src/organisms/governance/proposal/index.tsx');
const hooksSource = readSource('src/hooks/governance/hooks.tsx');
const pollingHookSource = readSource('src/hooks/common/useScreenRefreshPolling.ts');

describe('governance polling owners', () => {
    it.each([
        ['Governance', governanceSource],
        ['Proposal', proposalSource]
    ])('routes %s through one completion-scheduled polling owner', (_name, source) => {
        // Given
        const pollingImport = /import \{ useScreenRefreshPolling \} from '@\/hooks\/common\/useScreenRefreshPolling';/;

        // When
        const pollingOwners = source.match(/useScreenRefreshPolling\(\{/g) ?? [];

        // Then
        expect(pollingImport.test(source)).toBe(true);
        expect(pollingOwners).toHaveLength(1);
        expect(source).not.toContain('useInterval(');
        expect(source).not.toContain('dataLoadStatus > 0');
    });

    it('preserves each existing eligibility boundary', () => {
        // Given
        const eligibility = /isFocused\s*&&\s*appState === 'active'\s*&&\s*\(!requireStableNetwork \|\| !isNetworkChanged\)/;

        // When
        const eligibilityIsPreserved =
            eligibility.test(pollingHookSource) &&
            !governanceSource.includes('requireStableNetwork: false') &&
            proposalSource.includes('requireStableNetwork: false');

        // Then
        expect(eligibilityIsPreserved).toBe(true);
    });

    it('wires both existing pull surfaces to the shared active request', () => {
        // Given
        const listPullUsesOwner = /<RefreshControl refreshing=\{refreshing\} onRefresh=\{onRefresh\}/.test(governanceSource);
        const proposalPullUsesOwner = /<RefreshScrollView refreshFunc=\{refreshNow\}>/.test(proposalSource);

        // When
        const listManualRefreshAwaitsOwner = /await refreshNow\(\)/.test(governanceSource);

        // Then
        expect(listPullUsesOwner && listManualRefreshAwaitsOwner).toBe(true);
        expect(proposalPullUsesOwner).toBe(true);
    });

    it('passes lifecycle validity into both data hooks and removes hook-owned fetching', () => {
        // Given
        const guardedCommits = hooksSource.match(/lifecycle\?\.isValid\(\) === false/g) ?? [];

        // When
        const ownersPassLifecycle =
            hooksSource.includes('handleGovernanceListPolling = async (lifecycle?: RefreshLifecycle)') &&
            proposalSource.includes('handleProposalPolling(proposalId, lifecycle)');

        // Then
        expect(ownersPassLifecycle).toBe(true);
        expect(guardedCommits.length).toBeGreaterThanOrEqual(4);
        expect(hooksSource).not.toContain('handleGovernanceListPolling();');
    });
});

describe('governance polling terminal scenario', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it.each(['Governance list', 'Proposal'])('%s starts the next request exactly 30 seconds after valid settlement', async () => {
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
        const pullRequest = controller.refreshNow();
        const repeatedPullRequest = controller.refreshNow();
        requests[0]?.resolve(1);
        await Promise.all([focusRequest, pullRequest, repeatedPullRequest]);
        await jest.advanceTimersByTimeAsync(DELAY - 1);

        // Then
        expect(refresh).toHaveBeenCalledTimes(1);
        await jest.advanceTimersByTimeAsync(1);
        expect(refresh).toHaveBeenCalledTimes(2);
        controller.dispose();
    });

    it.each(['blur', 'inactive app', 'network transition'])(
        '%s invalidation clears scheduled work and refocus starts one request',
        async () => {
            // Given
            let eligible = true;
            const refresh = jest.fn<() => Promise<number>>().mockResolvedValue(1);
            const controller = createRefreshPollingController({
                refresh,
                commit: jest.fn<(value: number, lifecycle: RefreshLifecycle) => void>(),
                isEligible: () => eligible,
                delay: DELAY,
                retryLimit: 3,
                onError: jest.fn<(error: unknown) => void>()
            });
            await controller.setEligible(true);

            // When
            eligible = false;
            await controller.setEligible(false);
            await jest.advanceTimersByTimeAsync(DELAY);
            eligible = true;
            await Promise.all([controller.setEligible(true), controller.setEligible(true)]);

            // Then
            expect(refresh).toHaveBeenCalledTimes(2);
            controller.dispose();
        }
    );

    it.each(['Governance list', 'Proposal'])('%s stops automatic refresh after four rejected attempts', async () => {
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
