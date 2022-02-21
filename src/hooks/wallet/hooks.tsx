import { useCurrentHistoryByAddressQuery, useHistoryByAddressQuery } from "@/apollo/gqls";
import { getBalanceFromAdr } from "@/util/firma";
import { useEffect, useState } from "react";
import { convertNumber } from "../../util/common";

export interface BalanceState {
    available: number;
    delegateAvailable: number;
    delegated: number;
    undelegate: number;
    reward: number;
}

export interface HistoryListState {
    list: Array<any>;
}

export interface HistoryState {
    hash: any;
    success: string;
    type: string | undefined;
    timestamp: any;
    block: any;
}

export const useBalanceData = (address:string) => {
    const [balance, setBalance] = useState(0);
    
    async function getBalance() {
        if(address === '' || address === undefined) return;
        await getBalanceFromAdr(address).then(res => setBalance(convertNumber(res)));
    }

    useEffect(() => {
        getBalance();
    }, []);

    return {
        balance,
        getBalance,
    }
}

export const useHistoryData = (address:string) => {
    const [historyList, setHistoryList] = useState<HistoryListState>({
        list: [],
    });
    const [recentHistory, setRecentHistory] = useState<HistoryState>();

    if(address === '' || address === undefined) return {historyList};
    
    const convertMsgType = (type:string) => {
        const value = type.replace("Msg","").split(".");
        const result = value.pop();
        return result;
    }

    function convertResult(success:boolean) {
        if(success) return "Success";
        return "Failed"
    }

    const {startPolling: startHistoryPoling } = useHistoryByAddressQuery({
        address: `{${address}}`,
        onCompleted:(data) => {
            const list = data.messagesByAddress.map((value:any) => {
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
    });

    const {startPolling: startCurrentHistoryPolling, stopPolling: stopCurrentHistoryPolling} = useCurrentHistoryByAddressQuery({
        address: `{${address}}`,
        onCompleted:(data) => {
            const history = data.messagesByAddress.map((value:any) => {
                const result = {
                    hash: value.transaction.hash,
                    success: convertResult(value.transaction.success),
                    type: convertMsgType(value.transaction.messages[0]["@type"]),
                    timestamp: value.transaction.block.timestamp,
                    block: value.transaction.block.height,    
                }
                return result;
            })
            setRecentHistory(history[0]);
        }
    });

    const handleHisotyPolling = () => {
        return startHistoryPoling(0);
    }

    const handleCurrentHistoryPolling = (polling: boolean) => {
        if(polling) return startCurrentHistoryPolling(30000);
        return stopCurrentHistoryPolling();
    }

    const handleCurrentHistoryState = () => {
        startCurrentHistoryPolling(0);
    }

    return {
        historyList, 
        recentHistory,
        handleCurrentHistoryState,
        handleHisotyPolling,
        handleCurrentHistoryPolling,
    }
}