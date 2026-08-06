import { describe, expect, it, jest } from '@jest/globals';

import { useStakingData, type IStakingState } from '@/hooks/staking/hooks';

const mockSetStakingState = jest.fn<(value: IStakingState) => void>();
const mockUpdateStakingRewardState = jest.fn<(value: number) => void>();
const mockGetStaking = jest.fn<() => Promise<IStakingState>>();

jest.mock('@/../config', () => ({ CHAIN_NETWORK: {} }));
jest.mock('@/constants/common', () => ({ BLOCKS_PER_YEAR: 1 }));

jest.mock('@firmachain/firma-js', () => ({
    FirmaUtil: {}
}));

jest.mock('react', () => ({
    useCallback: <T>(callback: T): T => callback,
    useEffect: () => undefined,
    useMemo: <T>(factory: () => T): T => factory(),
    useState: () => [null, mockSetStakingState]
}));

jest.mock('@/redux/actions', () => ({
    StakingActions: {
        updateStakingRewardState: (value: number) => mockUpdateStakingRewardState(value)
    }
}));

jest.mock('@/redux/hooks', () => ({
    useAppSelector: (
        selector: (state: { readonly wallet: { readonly address: string }; readonly storage: { readonly network: string } }) => unknown
    ) =>
        selector({
            wallet: { address: 'firma1wallet' },
            storage: { network: 'mainnet' }
        })
}));

jest.mock('@/util/firma', () => ({
    getStaking: () => mockGetStaking()
}));

type Deferred<T> = {
    readonly promise: Promise<T>;
    readonly resolve: (value: T) => void;
};

const deferred = <T>(): Deferred<T> => {
    let resolvePromise: (value: T) => void = () => undefined;
    const promise = new Promise<T>((resolve) => {
        resolvePromise = resolve;
    });
    return { promise, resolve: resolvePromise };
};

describe('useStakingData lifecycle commits', () => {
    it('does not commit a delayed staking response after its lifecycle becomes invalid', async () => {
        // Given
        const response = deferred<IStakingState>();
        mockGetStaking.mockReturnValueOnce(response.promise);
        const { getStakingState } = useStakingData();
        let isValid = true;
        const lifecycle = { isValid: () => isValid };
        const request: Promise<void> = Reflect.apply(getStakingState, undefined, [lifecycle]);

        // When
        isValid = false;
        response.resolve({ available: 1, delegated: 2, undelegate: 3, stakingReward: 4 });
        await request;

        // Then
        expect(mockSetStakingState).not.toHaveBeenCalled();
        expect(mockUpdateStakingRewardState).not.toHaveBeenCalled();
    });
});
