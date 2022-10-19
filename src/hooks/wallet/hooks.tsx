import { useEffect, useState } from 'react';
import { useHistoryByAddressQuery } from '@/apollo/gqls';
import { useAppSelector } from '@/redux/hooks';
import { getBalanceFromAdr } from '@/util/firma';
import { convertNumber, wait } from '@/util/common';
import { TRANSACTION_TYPE_MODEL } from '@/constants/common';
import { PointColor } from '@/constants/theme';
import { StorageActions } from '@/redux/actions';

export interface IBalanceState {
    available: number;
    delegateAvailable: number;
    delegated: number;
    undelegate: number;
    reward: number;
}

export interface IHistoryState {
    hash: any;
    success: string;
    type: {
        tagTheme: string;
        tagDisplay: string;
    };
    timestamp: any;
    block: any;
}

export interface IHistoryListState {
    list: Array<IHistoryState>;
}

export const useBalanceData = () => {
    const { wallet, storage, common } = useAppSelector((state) => state);
    const [balance, setBalance] = useState(0);

    async function getBalance() {
        if (wallet.address === '' || wallet.address === undefined) return;
        try {
            const result = await getBalanceFromAdr(wallet.address);
            setBalance(convertNumber(result));
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    useEffect(() => {
        if (common.lockStation === false) {
            getBalance();
        }
    }, [storage.network, common.lockStation]);

    return {
        balance,
        getBalance
    };
};

export const useHistoryData = () => {
    const { wallet, storage, common } = useAppSelector((state) => state);
    const [historyList, setHistoryList] = useState<IHistoryListState>({
        list: []
    });
    const [recentHistory, setRecentHistory] = useState<IHistoryState>();
    const [historyOffset, setHistoryOffset] = useState(0);

    const handleHistoryOffset = (reset: boolean) => {
        setHistoryOffset(reset ? 0 : historyOffset + 30);
    };

    const convertMsgType = (type: string) => {
        let result = TRANSACTION_TYPE_MODEL[type];
        if (result === undefined || result === null) {
            const value = type.replace('Msg', '').split('.');
            result = {
                tagTheme: PointColor,
                tagDisplay: value.pop()
            };
        }
        return result;
    };

    function convertResult(success: boolean) {
        if (success) return 'Success';
        return 'Failed';
    }

    const {
        startPolling: startHistoryPolling,
        refetch: historyRefetch,
        loading: historyLoading,
        data: historyData
    } = useHistoryByAddressQuery({ address: `{${wallet.address}}`, offset: historyOffset, limit: 30 });

    useEffect(() => {
        if (historyLoading === false) {
            if (historyData) {
                if (historyOffset === 0) {
                    if (storage.historyVolume === undefined) {
                        StorageActions.handleHistoryVolume({
                            [wallet.address]: historyData.messagesByAddress.length
                        });
                    } else {
                        StorageActions.handleHistoryVolume({
                            ...storage.historyVolume,
                            [wallet.address]: historyData.messagesByAddress.length
                        });
                    }
                }
                const list = historyData.messagesByAddress.map((value: any) => {
                    const result = {
                        hash: value.transaction.hash,
                        success: convertResult(value.transaction.success),
                        type: convertMsgType(value.transaction.messages[0]['@type']),
                        timestamp: value.transaction.block.timestamp,
                        block: value.transaction.block.height
                    };
                    return result;
                });
                if (list.length > 0 && list[0].block !== recentHistory?.block) {
                    setRecentHistory(list[0]);
                }

                setHistoryList((prevState) => ({
                    ...prevState,
                    list
                }));
            }
        }
    }, [historyLoading, historyData]);

    const handleHisotyPolling = () => {
        handleHistoryOffset(true);
        wait(100).then(async () => await historyRefetch());
    };

    const currentHistoryPolling = async (polling: boolean) => {
        if (polling) {
            await historyRefetch();
            startHistoryPolling(30000);
        } else {
            startHistoryPolling(0);
        }
    };

    useEffect(() => {
        if (common.lockStation === false) {
            setHistoryList({ list: [] });
            setRecentHistory(undefined);
            handleHisotyPolling();
        }
    }, [storage.network, common.lockStation]);

    return {
        historyList,
        recentHistory,
        handleHisotyPolling,
        currentHistoryPolling,
        handleHistoryOffset
    };
};
