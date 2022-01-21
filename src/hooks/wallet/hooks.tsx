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

export const useBalanceData = (address:string) => {
    const [refresh, setRefresh] = useState(true);
    const [barrier, setBarrier] = useState(false);

    const [balance, setBalance] = useState(0);

    async function getBalance() {
        await getBalanceFromAdr(address).then(res => setBalance(convertNumber(res)));
        setRefresh(false);
    }

    useEffect(() => {
        if(barrier) return;

        const interval = setInterval(() => {
            setBarrier(false);
            clearInterval(interval);
        }, 5000);

      getBalance();
    }, [refresh]);

    return {
        balance,
        setRefresh
    }
}