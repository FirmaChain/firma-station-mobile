import { useCallback, useEffect, useState } from 'react';
import { getHistoryByAddressData } from '@/apollo/gqls';
import { TRANSACTION_TYPE_MODEL } from '@/constants/common';
import { PointColor } from '@/constants/theme';
import { StorageActions } from '@/redux/actions';
import { useAppSelector } from '@/redux/hooks';
import { convertNumber } from '@/util/common';
import { getBalanceFromAdr } from '@/util/firma';
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
    const { address: walletAddress } = useAppSelector((state) => state.wallet);
    const { network } = useAppSelector((state) => state.storage);
    const { lockStation } = useAppSelector((state) => state.common);

    const [balance, setBalance] = useState(0);

    async function getBalance() {
        if (walletAddress === '' || walletAddress === undefined) return;
        try {
            const result = await getBalanceFromAdr(walletAddress);
            setBalance(convertNumber(result));
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    useEffect(() => {
        if (lockStation === false) {
            getBalance();
        }
    }, [network, lockStation]);

    return {
        balance,
        getBalance
    };
};

export const useHistoryData = () => {
    const { address: walletAddress } = useAppSelector((state) => state.wallet);
    const { network, historyVolume } = useAppSelector((state) => state.storage);

    const [historyList, setHistoryList] = useState<IHistoryListState>({
        list: []
    });
    const [recentHistory, setRecentHistory] = useState<IHistoryState>();
    const [historyOffset, setHistoryOffset] = useState(0);

    const handleHistoryOffset = (reset: boolean) => {
        const offset = reset ? 0 : historyOffset + 30;
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
                address: `{${walletAddress}}`,
                offset: offset,
                limit: 30
            })
                .then(async ({ data, loading }) => {
                    if (!loading) {
                        // loading looks not provided anymore
                        if (data !== undefined) {
                            if (offset === 0) {
                                if (historyVolume === undefined) {
                                    StorageActions.handleHistoryVolume({
                                        [walletAddress]: data.messagesByAddress.length
                                    });
                                } else {
                                    StorageActions.handleHistoryVolume({
                                        ...historyVolume,
                                        [walletAddress]: data.messagesByAddress.length
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
        [walletAddress]
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
    }, [network]);

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
                    vs_currencies: 'usd'
                }
            });
            const transformedPrices = transformPrices(response.data);
            setPriceData(transformedPrices);
        } catch (error) {
            console.error('Error fetching prices:', error);
            throw error;
        }
    };

    return { priceData, fetchPrices };
};
