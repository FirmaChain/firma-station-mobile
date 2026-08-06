import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { useHistoryData } from '@/hooks/wallet/hooks';

type HistoryResponse = {
    readonly messagesByAddress: readonly HistoryMessage[];
};

type HistoryMessage = {
    readonly transaction: {
        readonly block: { readonly height: number; readonly timestamp: string };
        readonly hash: string;
        readonly messages: readonly [{ readonly '@type': string }];
        readonly success: boolean;
    };
};

type Deferred<T> = {
    readonly promise: Promise<T>;
    readonly reject: (reason: Error) => void;
    readonly resolve: (value: T) => void;
};

const mockGetHistoryByAddressData = jest.fn<() => Promise<HistoryResponse>>();
const mockHandleHistoryVolume = jest.fn<(value: Readonly<Record<string, number>>) => void>();
const mockSetHistoryList = jest.fn();
const mockSetRecentHistory = jest.fn();

jest.mock('@/../config', () => ({ COINGECKO: '', COINGECKO_PRICE_LIST: '' }));
jest.mock('@/constants/common', () => ({ TRANSACTION_TYPE_MODEL: {} }));
jest.mock('@/constants/theme', () => ({ PointColor: '' }));

jest.mock('react', () => ({
    useCallback: <T>(callback: T): T => callback,
    useEffect: () => undefined,
    useState: (initial: unknown) => {
        if (typeof initial === 'object' && initial !== null && 'list' in initial) return [initial, mockSetHistoryList];
        if (initial === undefined) return [initial, mockSetRecentHistory];
        return [initial, jest.fn()];
    }
}));

jest.mock('@/gql/query', () => ({
    getHistoryByAddressData: () => mockGetHistoryByAddressData()
}));

jest.mock('@/redux/actions', () => ({
    StorageActions: { handleHistoryVolume: (value: Readonly<Record<string, number>>) => mockHandleHistoryVolume(value) }
}));

jest.mock('@/redux/hooks', () => ({
    useAppSelector: (
        selector: (state: {
            readonly wallet: { readonly address: string };
            readonly storage: { readonly historyVolume: undefined; readonly network: string };
        }) => unknown
    ) =>
        selector({
            wallet: { address: 'firma1wallet' },
            storage: { historyVolume: undefined, network: 'mainnet' }
        })
}));

jest.mock('@/util/common', () => ({ convertNumber: jest.fn() }));
jest.mock('@/util/firma', () => ({ getBalanceFromAdr: jest.fn() }));
jest.mock('@/util/kyService', () => ({ getJson: jest.fn() }));

const deferred = <T>(): Deferred<T> => {
    let rejectPromise: (reason: Error) => void = () => undefined;
    let resolvePromise: (value: T) => void = () => undefined;
    const promise = new Promise<T>((resolve, reject) => {
        rejectPromise = reject;
        resolvePromise = resolve;
    });
    return { promise, reject: rejectPromise, resolve: resolvePromise };
};

describe('wallet history async boundary characterization', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns the full GraphQL, transform, and commit promise', async () => {
        // Given
        const response = deferred<HistoryResponse>();
        mockGetHistoryByAddressData.mockReturnValueOnce(response.promise);
        const { handleHisotyPolling } = useHistoryData();

        // When
        let settled = false;
        const polling = handleHisotyPolling().then(() => {
            settled = true;
        });
        await Promise.resolve();

        // Then
        expect(mockGetHistoryByAddressData).toHaveBeenCalledTimes(1);
        expect(settled).toBe(false);
        response.resolve({
            messagesByAddress: [
                {
                    transaction: {
                        block: { height: 1, timestamp: '2026-08-06T00:00:00Z' },
                        hash: 'hash-1',
                        messages: [{ '@type': 'firma.MsgTransfer' }],
                        success: true
                    }
                }
            ]
        });
        await polling;
        expect(mockHandleHistoryVolume).toHaveBeenCalledTimes(1);
        expect(mockSetHistoryList).toHaveBeenCalledTimes(1);
    });

    it('does not commit a delayed history response after its lifecycle becomes invalid', async () => {
        // Given
        const response = deferred<HistoryResponse>();
        mockGetHistoryByAddressData.mockReturnValueOnce(response.promise);
        const { handleHisotyPolling } = useHistoryData();
        let isValid = true;
        const request: Promise<void> = Reflect.apply(handleHisotyPolling, undefined, [{ isValid: () => isValid }]);

        // When
        isValid = false;
        response.resolve({
            messagesByAddress: [
                {
                    transaction: {
                        block: { height: 2, timestamp: '2026-08-06T00:00:01Z' },
                        hash: 'stale-hash',
                        messages: [{ '@type': 'firma.MsgTransfer' }],
                        success: true
                    }
                }
            ]
        });
        await request;

        // Then
        expect(mockHandleHistoryVolume).not.toHaveBeenCalled();
        expect(mockSetRecentHistory).not.toHaveBeenCalled();
        expect(mockSetHistoryList).not.toHaveBeenCalled();
    });

    it('does not surface a delayed history error after its lifecycle becomes invalid', async () => {
        // Given
        const response = deferred<HistoryResponse>();
        mockGetHistoryByAddressData.mockReturnValueOnce(response.promise);
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
        const { handleHisotyPolling } = useHistoryData();
        let isValid = true;
        const request: Promise<void> = Reflect.apply(handleHisotyPolling, undefined, [{ isValid: () => isValid }]);

        // When
        isValid = false;
        response.reject(new Error('stale history failure'));
        await request;

        // Then
        expect(errorSpy).not.toHaveBeenCalled();
        errorSpy.mockRestore();
    });
});
