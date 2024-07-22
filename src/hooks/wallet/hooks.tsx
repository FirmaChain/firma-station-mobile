import { useCallback, useEffect, useState } from 'react';
import { getHistoryByAddressData } from '@/apollo/gqls';
import { useAppSelector } from '@/redux/hooks';
import { getBalanceFromAdr } from '@/util/firma';
import { convertNumber } from '@/util/common';
import { TRANSACTION_TYPE_MODEL } from '@/constants/common';
import { PointColor } from '@/constants/theme';
import { StorageActions } from '@/redux/actions';
import axios from 'axios';
import { COINGECKO, COINGECKO_PRICE_LIST } from '../../../config';

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
export interface CryptoPrices {
    [chain: string]: number;
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
    const { wallet, storage } = useAppSelector((state) => state);
    const [historyList, setHistoryList] = useState<IHistoryListState>({
        list: []
    });
    const [recentHistory, setRecentHistory] = useState<IHistoryState>();
    const [historyOffset, setHistoryOffset] = useState(0);

    const handleHistoryOffset = (reset: boolean) => {
        let offset = reset ? 0 : historyOffset + 30;
        setHistoryOffset(offset);
        getHistoryByAddress(offset);
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

    const getHistoryByAddress = useCallback(
        (offset: number) => {
            getHistoryByAddressData({
                address: `{${wallet.address}}`,
                offset: offset,
                limit: 30
            })
                .then(async ({ data, loading }) => {
                    if (loading === false) {
                        if (data !== undefined) {
                            if (offset === 0) {
                                if (storage.historyVolume === undefined) {
                                    StorageActions.handleHistoryVolume({
                                        [wallet.address]: data.messagesByAddress.length
                                    });
                                } else {
                                    StorageActions.handleHistoryVolume({
                                        ...storage.historyVolume,
                                        [wallet.address]: data.messagesByAddress.length
                                    });
                                }
                            }

                            const list = data.messagesByAddress.map((value: any) => {
                                const result = {
                                    hash: value.transaction.hash,
                                    success: convertResult(value.transaction.success),
                                    type: convertMsgType(value.transaction.messages[0]['@type']),
                                    timestamp: value.transaction.block.timestamp,
                                    block: value.transaction.block.height
                                };
                                return result;
                            });

                            if (list.length > 0 && list[0].hash !== recentHistory?.hash) {
                                setRecentHistory(list[0]);
                            }

                            setHistoryList((prevState) => ({
                                ...prevState,
                                list
                            }));
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                    throw error;
                });
        },
        [wallet.address]
    );

    const handleHisotyPolling = async () => {
        try {
            handleHistoryOffset(true);
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        const handleRefreshHistory = async () => {
            try {
                setHistoryList({ list: [] });
                setRecentHistory(undefined);
                await handleHisotyPolling();
            } catch (error) {
                console.log(error);
                throw error;
            }
        };

        handleRefreshHistory();
    }, [storage.network]);

    return {
        historyList,
        recentHistory,
        handleHisotyPolling,
        handleHistoryOffset
    };
};

export const useFetchPrices = () => {
    const [priceData, setPriceData] = useState<CryptoPrices | null>(null);


    const transformPrices = (data: any): CryptoPrices => {
        const transformed: CryptoPrices = {};
        for (const [chain, priceObj] of Object.entries(data)) {
            transformed[chain] = (priceObj as { [currency: string]: number }).usd;
        }
        return transformed;
    };

    const fetchPrices = async () => {
        try {
            const response = await axios.get(COINGECKO, {
                params: {
                    ids: COINGECKO_PRICE_LIST,
                    vs_currencies: 'usd',
                },
            });
            const transformedPrices = transformPrices(response.data);
            setPriceData(transformedPrices);
        } catch (error) {
            console.error('Error fetching prices:', error);
            throw error;
        }
    };

    useEffect(() => {
        fetchPrices();
    }, [])

    return { priceData, fetchPrices }
}