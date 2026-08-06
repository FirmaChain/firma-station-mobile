import Wallet from '@/organisms/wallet/wallet';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { createRefreshPollingController, type RefreshLifecycle, type RefreshPollingOptions } from '@/hooks/common/useRefreshPolling';

const DELAY = 30_000;

type Deferred<T> = {
    readonly promise: Promise<T>;
    readonly reject: (reason: Error) => void;
    readonly resolve: (value: T) => void;
};

const mockGetStakingState = jest.fn<(lifecycle?: RefreshLifecycle) => Promise<void>>();
const mockHandleHistoryPolling = jest.fn<(lifecycle?: RefreshLifecycle) => Promise<void>>();
const mockGetTokenList = jest.fn<() => Promise<readonly string[]>>();
const mockSetTokenList = jest.fn<(tokens: readonly string[]) => void>();
const mockSetIbcTokenConfig = jest.fn<(config: Readonly<Record<string, unknown>>) => void>();
const mockHandleDataLoadStatus = jest.fn<(status: number) => void>();
const mockToastShow = jest.fn<(options: Readonly<Record<string, unknown>>) => void>();
const mockRefreshNow = jest.fn<() => Promise<void>>();
let mockPollingOptions: RefreshPollingOptions<void> | undefined;
let mockAppState = 'active';
let mockFocused = true;
let mockNetworkChanged = false;

const deferred = <T,>(): Deferred<T> => {
    let rejectPromise: (reason: Error) => void = () => undefined;
    let resolvePromise: (value: T) => void = () => undefined;
    const promise = new Promise<T>((resolve, reject) => {
        rejectPromise = reject;
        resolvePromise = resolve;
    });
    return { promise, reject: rejectPromise, resolve: resolvePromise };
};

jest.mock('react', () => {
    const react = {
        createElement: (type: unknown, props: Record<string, unknown> | null, ...children: unknown[]) => ({
            type,
            props: { ...props, children }
        }),
        useCallback: <T,>(callback: T): T => callback,
        useEffect: () => undefined,
        useMemo: <T,>(factory: () => T): T => factory(),
        useState: <T,>(initial: T) => [initial, jest.fn()]
    };
    return { __esModule: true, ...react, default: react };
});

jest.mock('react/jsx-runtime', () => ({
    Fragment: 'Fragment',
    jsx: (type: unknown, props: Record<string, unknown>) => ({ type, props }),
    jsxs: (type: unknown, props: Record<string, unknown>) => ({ type, props })
}));

jest.mock('@/../config', () => ({ IBC_CONFIG: { channel: 'channel-1' } }));
jest.mock('@/constants/common', () => ({ DATA_RELOAD_INTERVAL: DELAY }));
jest.mock('@/constants/theme', () => ({ BgColor: '#000' }));
jest.mock('@/navigators/appRoutes', () => ({ Screens: { Wallet: 'Wallet' } }));

jest.mock('@react-navigation/native', () => ({
    useIsFocused: () => mockFocused,
    useNavigation: () => ({ navigate: jest.fn() })
}));

jest.mock('react-native', () => ({
    StyleSheet: { create: <T,>(styles: T): T => styles },
    View: 'View'
}));

jest.mock('react-native-toast-message', () => ({
    __esModule: true,
    default: { show: (options: Readonly<Record<string, unknown>>) => mockToastShow(options) }
}));

jest.mock('@/components/parts/refreshScrollView', () => ({ __esModule: true, default: 'RefreshScrollView' }));
jest.mock('@/organisms/wallet/wallet/addressBox', () => ({ __esModule: true, default: 'AddressBox' }));
jest.mock('@/organisms/wallet/wallet/assetsBox', () => ({ __esModule: true, default: 'AssetsBox' }));
jest.mock('@/organisms/wallet/wallet/balanceBox', () => ({ __esModule: true, default: 'BalanceBox' }));
jest.mock('@/organisms/wallet/wallet/historyBox', () => ({ __esModule: true, default: 'HistoryBox' }));
jest.mock('@/organisms/wallet/wallet/stakingBox', () => ({ __esModule: true, default: 'StakingBox' }));

jest.mock('@/hooks/common/hooks', () => ({ useInterval: jest.fn() }));
jest.mock('@/hooks/common/useRefreshPolling', () => {
    const actual = jest.requireActual<typeof import('@/hooks/common/useRefreshPolling')>('@/hooks/common/useRefreshPolling');
    return {
        ...actual,
        useRefreshPolling: (options: RefreshPollingOptions<void>) => {
            mockPollingOptions = options;
            return mockRefreshNow;
        }
    };
});

jest.mock('@/hooks/staking/hooks', () => ({
    useStakingData: () => ({ getStakingState: mockGetStakingState, stakingState: null })
}));

jest.mock('@/hooks/wallet/hooks', () => ({
    useHistoryData: () => ({ handleHisotyPolling: mockHandleHistoryPolling, recentHistory: undefined })
}));

jest.mock('@/context/ibcTokenContext', () => ({
    useIBCTokenContext: () => ({ setIbcTokenConfig: mockSetIbcTokenConfig, setTokenList: mockSetTokenList })
}));

jest.mock('@/redux/actions', () => ({
    CommonActions: { handleDataLoadStatus: (status: number) => mockHandleDataLoadStatus(status) }
}));

jest.mock('@/redux/hooks', () => ({
    useAppSelector: (
        selector: (state: {
            readonly common: {
                readonly appState: string;
                readonly connect: boolean;
                readonly dataLoadStatus: number;
                readonly isNetworkChanged: boolean;
            };
            readonly storage: { readonly historyVolume: undefined };
            readonly wallet: { readonly address: string };
        }) => unknown
    ) =>
        selector({
            common: { appState: mockAppState, connect: true, dataLoadStatus: 0, isNetworkChanged: mockNetworkChanged },
            storage: { historyVolume: undefined },
            wallet: { address: 'firma1wallet' }
        })
}));

jest.mock('@/util/firma', () => ({ getTokenList: () => mockGetTokenList() }));

const renderWallet = (): RefreshPollingOptions<void> => {
    Wallet();
    if (mockPollingOptions === undefined) throw new Error('Wallet did not register completion-scheduled polling');
    return mockPollingOptions;
};

describe('Wallet overview polling surface', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        mockPollingOptions = undefined;
        mockAppState = 'active';
        mockFocused = true;
        mockNetworkChanged = false;
    });

    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it('waits for all three Wallet requests before scheduling 30 seconds and joins manual refresh', async () => {
        // Given
        const stakingRequests = [deferred<void>(), deferred<void>()];
        const historyRequests = [deferred<void>(), deferred<void>()];
        const tokenRequests = [deferred<readonly string[]>(), deferred<readonly string[]>()];
        mockGetStakingState.mockImplementation(
            () => stakingRequests[mockGetStakingState.mock.calls.length - 1]?.promise ?? Promise.resolve()
        );
        mockHandleHistoryPolling.mockImplementation(
            () => historyRequests[mockHandleHistoryPolling.mock.calls.length - 1]?.promise ?? Promise.resolve()
        );
        mockGetTokenList.mockImplementation(() => tokenRequests[mockGetTokenList.mock.calls.length - 1]?.promise ?? Promise.resolve([]));
        const options = renderWallet();
        const controller = createRefreshPollingController(options);

        // When
        const focusRequest = controller.setEligible(true);
        const manualRequest = controller.refreshNow();
        stakingRequests[0]?.resolve();
        tokenRequests[0]?.resolve(['token-1']);
        await jest.advanceTimersByTimeAsync(DELAY);

        // Then
        expect(mockGetStakingState).toHaveBeenCalledTimes(1);
        expect(mockHandleHistoryPolling).toHaveBeenCalledTimes(1);
        expect(mockGetTokenList).toHaveBeenCalledTimes(1);
        historyRequests[0]?.resolve();
        await Promise.all([focusRequest, manualRequest]);
        await jest.advanceTimersByTimeAsync(DELAY - 1);
        expect(mockGetStakingState).toHaveBeenCalledTimes(1);
        await jest.advanceTimersByTimeAsync(1);
        expect(mockGetStakingState).toHaveBeenCalledTimes(2);
        controller.dispose();
        stakingRequests[1]?.resolve();
        historyRequests[1]?.resolve();
        tokenRequests[1]?.resolve([]);
    });

    it('is eligible only while focused, active, and on the current network with four total attempts', () => {
        // Given
        const activeOptions = renderWallet();

        // When
        mockFocused = false;
        const blurredOptions = renderWallet();
        mockFocused = true;
        mockAppState = 'inactive';
        const inactiveOptions = renderWallet();
        mockAppState = 'active';
        mockNetworkChanged = true;
        const changedNetworkOptions = renderWallet();

        // Then
        expect(activeOptions.isEligible()).toBe(true);
        expect(blurredOptions.isEligible()).toBe(false);
        expect(inactiveOptions.isEligible()).toBe(false);
        expect(changedNetworkOptions.isEligible()).toBe(false);
        expect(activeOptions.retryLimit).toBe(3);
    });

    it.each(['staking', 'history', 'token'] as const)(
        'waits for every started Wallet request before reporting a %s failure',
        async (failureSource) => {
            // Given
            const stakingRequest = deferred<void>();
            const historyRequest = deferred<void>();
            const tokenRequest = deferred<readonly string[]>();
            mockGetStakingState.mockReturnValueOnce(stakingRequest.promise);
            mockHandleHistoryPolling.mockReturnValueOnce(historyRequest.promise);
            mockGetTokenList.mockReturnValueOnce(tokenRequest.promise);
            const failure = new Error(`${failureSource} failure`);
            const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
            let settled = false;
            const outcome = renderWallet()
                .refresh({ isValid: () => true })
                .then(
                    () => {
                        settled = true;
                        return undefined;
                    },
                    (error: unknown) => {
                        settled = true;
                        return error;
                    }
                );

            // When
            if (failureSource === 'staking') stakingRequest.reject(failure);
            else if (failureSource === 'token') stakingRequest.resolve();
            if (failureSource === 'history') historyRequest.reject(failure);
            if (failureSource === 'token') tokenRequest.reject(failure);
            else tokenRequest.resolve([]);
            await jest.advanceTimersByTimeAsync(0);

            // Then
            expect(settled).toBe(false);
            stakingRequest.resolve();
            historyRequest.resolve();
            tokenRequest.resolve([]);
            expect(await outcome).toBe(failure);
            errorSpy.mockRestore();
        }
    );

    it('drops stale commits after invalidation and runs one fresh aggregate after refocus', async () => {
        // Given
        const stakingRequests = [deferred<void>(), deferred<void>()];
        const historyRequests = [deferred<void>(), deferred<void>()];
        const tokenRequests = [deferred<readonly string[]>(), deferred<readonly string[]>()];
        mockGetStakingState.mockImplementation(
            () => stakingRequests[mockGetStakingState.mock.calls.length - 1]?.promise ?? Promise.resolve()
        );
        mockHandleHistoryPolling.mockImplementation(
            () => historyRequests[mockHandleHistoryPolling.mock.calls.length - 1]?.promise ?? Promise.resolve()
        );
        mockGetTokenList.mockImplementation(() => tokenRequests[mockGetTokenList.mock.calls.length - 1]?.promise ?? Promise.resolve([]));
        const controller = createRefreshPollingController(renderWallet());
        const request = controller.setEligible(true);

        // When
        void controller.setEligible(false);
        void controller.setEligible(true);
        void controller.setEligible(true);
        const staleFailure = new Error('stale token failure');
        tokenRequests[0]?.reject(staleFailure);
        stakingRequests[0]?.resolve();
        historyRequests[0]?.resolve();
        await request;

        // Then
        expect(mockSetTokenList).not.toHaveBeenCalled();
        expect(mockSetIbcTokenConfig).not.toHaveBeenCalled();
        expect(mockHandleDataLoadStatus).not.toHaveBeenCalled();
        expect(mockToastShow).not.toHaveBeenCalled();
        expect(mockGetTokenList).toHaveBeenCalledTimes(2);
        stakingRequests[1]?.resolve();
        historyRequests[1]?.resolve();
        tokenRequests[1]?.resolve(['fresh-token']);
        await controller.refreshNow();
        expect(mockSetTokenList).toHaveBeenCalledTimes(1);
        expect(mockSetIbcTokenConfig).toHaveBeenCalledTimes(1);
        expect(mockHandleDataLoadStatus).not.toHaveBeenCalled();
        controller.dispose();
    });
});
