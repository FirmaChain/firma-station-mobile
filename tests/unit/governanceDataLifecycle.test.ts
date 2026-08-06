import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { createRefreshPollingController, type RefreshLifecycle } from '@/hooks/common/useRefreshPolling';
import { useGovernanceList, useProposalData, type IGovernanceState, type IProposalState } from '@/hooks/governance/hooks';

const mockSetGovernanceState = jest.fn<(value: IGovernanceState | ((state: IGovernanceState) => IGovernanceState)) => void>();
const mockSetProposalState = jest.fn<(value: IProposalState) => void>();
const mockHandleContentVolume = jest.fn<(value: { readonly proposals: number }) => void>();
const mockGoBack = jest.fn<() => void>();
const mockToastShow = jest.fn<(value: { readonly type: string; readonly text1: string }) => void>();
const mockGetProposals = jest.fn<() => Promise<readonly ProposalFixture[]>>();
const mockGetProposalByProposalId = jest.fn<() => Promise<ProposalFixture>>();
const mockGetProposalData = jest.fn<() => Promise<ProposalDataFixture>>();

type ProposalDataFixture = {
    readonly proposal: readonly [];
    readonly proposalVote: readonly [];
};

type ProposalFixture = {
    readonly id: number;
    readonly messages: readonly [];
    readonly status: string;
    readonly title: string;
    readonly summary: string;
    readonly deposit_end_time: string;
    readonly voting_start_time: string;
    readonly voting_end_time: string;
    readonly submit_time: string;
    readonly total_deposit: readonly [{ readonly amount: string }];
};

type Deferred<T> = {
    readonly promise: Promise<T>;
    readonly reject: (reason: Error) => void;
    readonly resolve: (value: T) => void;
};

const deferred = <T>(): Deferred<T> => {
    let rejectPromise: (reason: Error) => void = () => undefined;
    let resolvePromise: (value: T) => void = () => undefined;
    const promise = new Promise<T>((resolvePromiseValue, rejectPromiseValue) => {
        rejectPromise = rejectPromiseValue;
        resolvePromise = resolvePromiseValue;
    });
    return { promise, reject: rejectPromise, resolve: resolvePromise };
};

const proposalFixture: ProposalFixture = {
    id: 7,
    messages: [],
    status: 'PROPOSAL_STATUS_VOTING_PERIOD',
    title: 'Proposal',
    summary: 'Summary',
    deposit_end_time: '2026-01-02T00:00:00Z',
    voting_start_time: '2026-01-03T00:00:00Z',
    voting_end_time: '2026-01-04T00:00:00Z',
    submit_time: '2026-01-01T00:00:00Z',
    total_deposit: [{ amount: '1' }]
};

jest.mock('@/../config', () => ({ CHAIN_NETWORK: { mainnet: { PROPOSAL_JSON: 'https://proposal.test' } } }));
jest.mock('@/constants/common', () => ({
    ERROR_FETCHING_PROPOSAL_DATA: 'proposal-error',
    PROPOSAL_MESSAGE_TYPE: { '/cosmos.gov.v1beta1.TextProposal': 'text' }
}));
jest.mock('react', () => ({
    useCallback: <T>(callback: T): T => callback,
    useEffect: () => undefined,
    useState: <T>(initial: T) => [initial, initial === null ? mockSetProposalState : mockSetGovernanceState]
}));
jest.mock('@/redux/actions', () => ({
    StorageActions: { handleContentVolume: (value: { readonly proposals: number }) => mockHandleContentVolume(value) }
}));
jest.mock('@/redux/hooks', () => ({
    useAppSelector: (
        selector: (state: {
            readonly storage: { readonly network: 'mainnet'; readonly contentVolume: { readonly proposals: number } };
        }) => unknown
    ) => selector({ storage: { network: 'mainnet', contentVolume: { proposals: 0 } } })
}));
jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ goBack: mockGoBack }) }));
jest.mock('react-native-toast-message', () => ({ show: (value: { readonly type: string; readonly text1: string }) => mockToastShow(value) }));
jest.mock('@/util/common', () => ({ convertNumber: Number, convertTime: () => 'converted' }));
jest.mock('@/gql/query', () => ({ getProposalData: () => mockGetProposalData() }));
jest.mock('@/util/firma', () => ({
    getProposalByProposalId: () => mockGetProposalByProposalId(),
    getProposalParams: async () => ({ quorum: '0.5', max_deposit_period: '10s', min_deposit: [{ amount: '1' }] }),
    getProposals: () => mockGetProposals(),
    getProposalTally: async () => ({ yes: '1', abstain: '0', no: '0', no_with_veto: '0' })
}));

describe('governance data lifecycle commits', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetProposalData.mockResolvedValue({ proposal: [], proposalVote: [] });
        Object.defineProperty(globalThis, 'fetch', {
            configurable: true,
            value: jest.fn(async () => ({ json: async () => ({ ignoreProposalIdList: [] }) }))
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.useRealTimers();
    });

    it('does not commit a delayed governance list response after invalidation', async () => {
        // Given
        const response = deferred<readonly ProposalFixture[]>();
        mockGetProposals.mockReturnValueOnce(response.promise);
        const { handleGovernanceListPolling } = useGovernanceList();
        let isValid = true;
        const request = handleGovernanceListPolling({ isValid: () => isValid });

        // When
        isValid = false;
        response.resolve([proposalFixture]);
        await request;

        // Then
        expect(mockHandleContentVolume).not.toHaveBeenCalled();
        expect(mockSetGovernanceState).not.toHaveBeenCalled();
    });

    it('does not commit or navigate for a delayed proposal response after invalidation', async () => {
        // Given
        jest.useFakeTimers();
        const response = deferred<ProposalFixture>();
        mockGetProposalByProposalId.mockReturnValueOnce(response.promise);
        const { handleProposalPolling } = useProposalData();
        let isValid = true;
        const request = handleProposalPolling(7, { isValid: () => isValid });

        // When
        isValid = false;
        response.resolve(proposalFixture);
        await jest.advanceTimersByTimeAsync(1_000);
        await request;

        // Then
        expect(mockSetProposalState).not.toHaveBeenCalled();
        expect(mockToastShow).not.toHaveBeenCalled();
        expect(mockGoBack).not.toHaveBeenCalled();
    });

    it('does not log, commit, or retry when the inner GraphQL request rejects after invalidation', async () => {
        // Given
        jest.useFakeTimers();
        mockGetProposalByProposalId.mockResolvedValueOnce(proposalFixture);
        const graphQlResponse = deferred<ProposalDataFixture>();
        mockGetProposalData.mockReturnValueOnce(graphQlResponse.promise);
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
        const { handleProposalPolling } = useProposalData();
        let eligible = true;
        const commit = jest.fn<(value: void, lifecycle: RefreshLifecycle) => void>();
        const controller = createRefreshPollingController({
            refresh: (lifecycle) => handleProposalPolling(7, lifecycle),
            commit,
            isEligible: () => eligible,
            delay: 30_000,
            retryLimit: 3,
            onError: jest.fn<(error: unknown) => void>()
        });
        const request = controller.setEligible(true);
        await jest.advanceTimersByTimeAsync(1_000);

        // When
        eligible = false;
        const invalidatedRequest = controller.setEligible(false);
        graphQlResponse.reject(new Error('stale GraphQL failure'));
        await Promise.all([request, invalidatedRequest]);

        // Then
        expect(consoleError).not.toHaveBeenCalled();
        expect(mockSetProposalState).not.toHaveBeenCalled();
        expect(mockToastShow).not.toHaveBeenCalled();
        expect(mockGoBack).not.toHaveBeenCalled();
        expect(commit).not.toHaveBeenCalled();
        expect(jest.getTimerCount()).toBe(0);
        controller.dispose();
    });
});
