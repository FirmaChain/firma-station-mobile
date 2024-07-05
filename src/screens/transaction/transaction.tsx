import React from "react";
import Transaction from "@/organisms/transaction";

interface IProps {
    route: {params: TransactionParams};
}

export type TransactionParams = {
    state: any;
}

const TransactionScreen = (props:IProps) => {
    const {state} = props.route.params;
    return (
        <Transaction state={state} />
    )
}

export default React.memo(TransactionScreen);