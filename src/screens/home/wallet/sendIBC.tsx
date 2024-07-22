import { IBCTokenState } from "@/context/ibcTokenContext";
import SendIBC from "@/organisms/wallet/sendIBC";
import React from "react";

export type SendIBCParams = {
    tokenData: IBCTokenState
}

interface IProps {
    route: { params: SendIBCParams };
}


const SendIBCScreen = (props: IProps) => {
    const { tokenData } = props.route.params;
    return (
        <SendIBC tokenData={tokenData} />
    )
}

export default SendIBCScreen;