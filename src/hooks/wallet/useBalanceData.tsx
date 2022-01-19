import { useEffect, useMemo, useState } from "react";
import { convertToFctNumber } from "../../util/common";

const data:any = {
    available: 100000000,
    delegated: 50000000,
    undelegate: 10000000,
    reward: 5000000,
}


export interface BalanceState {
    available: number;
    delegated: number;
    undelegate: number;
    reward: number;
}

export const useBalanceData = () => {
    const [balanceData, setBalanceData] = useState<BalanceState | null>(null);

    useEffect(() => {
        if(data){
            setBalanceData({
                available: data.available,
                delegated: data.delegated,
                undelegate: data.undelegate,
                reward: data.reward,
            });
        }
    }, [data])

    return {
        balanceData,
    }
}

export const useOrganizedBalances = () => {
    const { balanceData } = useBalanceData();

    const organizedReward = useMemo(() => {
        if(balanceData !== null){
            return {title: "Staking reward", data: convertToFctNumber(balanceData.reward)};
        }
        return {title: "Staking reward", data: 0 };
    }, [balanceData])
    
    const organizedBalances = useMemo(() => {
        if(balanceData !== null){
            return [
                {title: "Available", data: convertToFctNumber(balanceData.available)},
                {title: "Delegated", data: convertToFctNumber(balanceData.delegated)},
                {title: "Undelegate", data: convertToFctNumber(balanceData.undelegate)},
            ];
        }

        return [
            {title: "Available", data: 0 },
            {title: "Delegated", data: 0 },
            {title: "Undelegate", data: 0 },
        ]
    }, [balanceData])

    return {
        organizedBalances,
        organizedReward,
    }
}