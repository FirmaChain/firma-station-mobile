import { useHistoryByAddressQuery } from "@/apollo/gqls";
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

export interface HistoryState {
    list: Array<any>;
}

export const useBalanceData = (address:string) => {
    const [balance, setBalance] = useState(0);
    
    async function getBalance() {
        if(address === '' || address === undefined) return;
        await getBalanceFromAdr(address).then(res => setBalance(convertNumber(res)));
    }

    useEffect(() => {
        getBalance();
        const interval = setInterval(() => {
            getBalance();
        }, 5000);

        return() => {
            clearInterval(interval);
        }
    }, []);

    return {
        balance,
    }
}

export const useHistoryData = (address:string) => {
    const [historyList, setHistoryList] = useState<HistoryState>({
        list: [],
    });
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

    useHistoryByAddressQuery({
        address: `{${address}}`,
        onCompleted:(data) => {
            const list = data.messagesByAddress.map((value:any) => {
                return {
                    hash: value.transaction.hash,
                    success: convertResult(value.transaction.success),
                    type: convertMsgType(value.transaction.messages[0]["@type"]),
                    timestamp: value.transaction.block.timestamp,
                    block: value.transaction.block.height,    
                }
            })
            setHistoryList((prevState) => ({
                ...prevState,
                list,
            }));
        }
    });

    return {historyList}
}