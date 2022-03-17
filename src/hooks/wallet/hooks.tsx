import { useEffect, useState } from "react";
import { useCurrentHistoryByAddressQuery, useHistoryByAddressQuery } from "@/apollo/gqls";
import { useAppSelector } from "@/redux/hooks";
import { getBalanceFromAdr } from "@/util/firma";
import { convertNumber } from "@/util/common";

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
    type: string | undefined;
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
        getBalance();
    }, [common.network]);

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

    if(wallet.address === '' || wallet.address === undefined) return {historyList};
    
    const convertMsgType = (type:string) => {
        const value = type.replace("Msg","").split(".");
        const result = value.pop();
        return result;
    }

    function convertResult(success:boolean) {
        if(success) return "Success";
        return "Failed"
    }

    const {refetch: startHistoryPoling, loading: historyLoading, data: historyData } = useHistoryByAddressQuery({address: `{${wallet.address}}`});

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

    const handleHisotyPolling = async() => {
        return await startHistoryPoling();
    }

    const currentHistoryPolling = (polling: boolean) => {
        if(polling) {
            startCurrentHistoryPolling(30000)
        } else {
            stopCurrentHistoryPolling();
        }
    }

    useEffect(() => {
        const changeChainNetwork = async() => {
            await refetchCurrentHistory();
            await handleHisotyPolling();
        }
        changeChainNetwork();
    }, [common.network]);

    return {
        historyList, 
        recentHistory,
        refetchCurrentHistory,
        handleHisotyPolling,
        currentHistoryPolling,
    }
}