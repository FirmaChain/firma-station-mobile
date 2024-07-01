import React from "react";
import SendCW20 from "@/organisms/dapps/sendCW20";

interface IProps {
    route: { params: SendCW20Params };
}

export type SendCW20Params = {
    contract: string;
    symbol: string
}


const SendCW20Screen = (props: IProps) => {
    const { contract, symbol } = props.route.params;

    return (
        <SendCW20 contract={contract} symbol={symbol} />
    )
}

export default React.memo(SendCW20Screen);