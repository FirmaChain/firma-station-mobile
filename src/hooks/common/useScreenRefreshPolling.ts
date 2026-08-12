import { useCallback } from 'react';
import { DATA_RELOAD_INTERVAL } from '@/constants/common';
import { useAppSelector } from '@/redux/hooks';
import { useIsFocused } from '@react-navigation/native';

import { useRefreshPolling, type RefreshPollingOptions } from './useRefreshPolling';

type ScreenRefreshPollingOptions<T> = Pick<RefreshPollingOptions<T>, 'refresh'> &
    Partial<Pick<RefreshPollingOptions<T>, 'commit' | 'isResultValid'>> & {
        readonly requireStableNetwork?: boolean;
        readonly onError?: (error: unknown) => void;
    };

const noopCommit = (): void => undefined;

const defaultOnError = (error: unknown): void => console.error(error);

export const useScreenRefreshEligibility = (requireStableNetwork = true): (() => boolean) => {
    const isFocused = useIsFocused();
    const appState = useAppSelector((state) => state.common.appState);
    const isNetworkChanged = useAppSelector((state) => state.common.isNetworkChanged);

    return useCallback(
        () => isFocused && appState === 'active' && (!requireStableNetwork || !isNetworkChanged),
        [appState, isFocused, isNetworkChanged, requireStableNetwork]
    );
};

export const useScreenRefreshPolling = <T>({
    refresh,
    commit = noopCommit,
    isResultValid,
    requireStableNetwork = true,
    onError = defaultOnError
}: ScreenRefreshPollingOptions<T>): (() => Promise<void>) => {
    const isEligible = useScreenRefreshEligibility(requireStableNetwork);

    return useRefreshPolling({
        refresh,
        commit,
        isResultValid,
        isEligible,
        delay: DATA_RELOAD_INTERVAL,
        retryLimit: 3,
        onError
    });
};
