import React from "react";
import Transaction from "@/organisms/transaction";

export type TransactionParams = {
    state: any;
}

interface Props {
    route: {params: TransactionParams};
}

const TransactionScreen = (props:Props) => {
    const {state} = props.route.params;
    return (
        <Transaction state={state} />
    )
}

export default React.memo(TransactionScreen);