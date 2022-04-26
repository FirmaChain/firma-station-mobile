import { useEffect, useState } from "react";
import { useCurrentHistoryByAddressQuery, useHistoryByAddressQuery } from "@/apollo/gqls";
import { useAppSelector } from "@/redux/hooks";
import { getBalanceFromAdr } from "@/util/firma";
import { convertNumber, wait } from "@/util/common";
import { TRANSACTION_TYPE_MODEL } from "@/constants/common";
import { PointColor } from "@/constants/theme";

export interface BalanceState {
    available: number;
    delegateAvailable: number;
    delegated: number;
    undelegate: number;
    reward: number;
}

export interface HistoryState {
    hash: any;
    success: string;
    type: {
        tagTheme: string,
        tagDisplay: string,
    }
    timestamp: any;
    block: any;
}

export interface HistoryListState {
    list: Array<HistoryState>;
}

export const useBalanceData = () => {
    const {wallet, common} = useAppSelector(state => state);
    const [balance, setBalance] = useState(0);
    
    async function getBalance() {
        if(wallet.address === '' || wallet.address === undefined) return;
        await getBalanceFromAdr(wallet.address).then(res => setBalance(convertNumber(res)));
    }

    useEffect(() => {
        if(common.lockStation === false){
            getBalance();
        }
    }, [common.network, common.lockStation]);

    return {
        balance,
        getBalance,
    }
}

export const useHistoryData = () => {
    const {wallet, common} = useAppSelector(state => state);
    const [historyList, setHistoryList] = useState<HistoryListState>({
        list: [],
    });
    const [recentHistory, setRecentHistory] = useState<HistoryState>();
    const [historyOffset, setHistoryOffset] = useState(0);

    if(wallet.address === '' || wallet.address === undefined) return {historyList};

    const handleHistoryOffset = (reset: boolean) => {
        setHistoryOffset(reset? 0:historyOffset + 30);
    }
    
    const convertMsgType = (type:string) => {
        let result = TRANSACTION_TYPE_MODEL[type];
        if(result === undefined || result === null){
            const value = type.replace("Msg","").split(".");
            result = {
                tagTheme: PointColor,
                tagDisplay: value.pop(),
            }
        }
        return result;
    }

    function convertResult(success:boolean) {
        if(success) return "Success";
        return "Failed"
    }

    const {refetch: startHistoryPoling, 
        loading: historyLoading, 
        data: historyData } = useHistoryByAddressQuery({address: `{${wallet.address}}`, offset: historyOffset, limit: 30});

    useEffect(() => {
        if(historyLoading === false){
            const list = historyData.messagesByAddress.map((value:any) => {
                const result = {
                    hash: value.transaction.hash,
                    success: convertResult(value.transaction.success),
                    type: convertMsgType(value.transaction.messages[0]["@type"]),
                    timestamp: value.transaction.block.timestamp,
                    block: value.transaction.block.height,    
                }
                return result;
            })
            setHistoryList((prevState) => ({
                ...prevState,
                list,
            }));
        }
    }, [historyLoading, historyData])

    const handleHisotyPolling = () => {
        handleHistoryOffset(true);
        wait(100).then(async() => await startHistoryPoling());
    }

    const {startPolling: startCurrentHistoryPolling, 
        stopPolling: stopCurrentHistoryPolling, 
        refetch: refetchCurrentHistory, 
        loading: currentHistoryLoading, 
        data: currentHistoryData} = useCurrentHistoryByAddressQuery({address: `{${wallet.address}}`});

    useEffect(() => {
        if(currentHistoryLoading === false){
            const history = currentHistoryData.messagesByAddress.map((value:any) => {
                const result = {
                    hash: value.transaction.hash,
                    success: convertResult(value.transaction.success),
                    type: convertMsgType(value.transaction.messages[0]["@type"]),
                    timestamp: value.transaction.block.timestamp,
                    block: value.transaction.block.height,    
                }
                return result;
            })
            if(history.length > 0 && history[0].block !== recentHistory?.block){
                setRecentHistory(history[0]);
            }
        }
    }, [currentHistoryLoading, currentHistoryData]);

    const currentHistoryPolling = (polling: boolean) => {
        if(polling) {
            startCurrentHistoryPolling(30000)
        } else {
            stopCurrentHistoryPolling();
        }
    }

    useEffect(() => {
        if(common.lockStation === false){
            setHistoryList({list:[]});
            setRecentHistory({
                hash: '',
                success: '',
                type: {
                    tagTheme: '',
                    tagDisplay: '',
                },
                timestamp: '',
                block: 0,
            });
            const changeChainNetwork = async() => {
                await refetchCurrentHistory();
                handleHisotyPolling();
            }
            changeChainNetwork();
        }
    }, [common.network, common.lockStation]);

    return {
        historyList, 
        recentHistory,
        refetchCurrentHistory,
        handleHisotyPolling,
        currentHistoryPolling,
        handleHistoryOffset,
    }
}