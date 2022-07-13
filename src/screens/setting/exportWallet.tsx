import React from "react";
import ExportWallet from "@/organisms/setting/exportWallet";

interface IProps {
    route: {params: ExportWalletParams};
}

export type ExportWalletParams = {
    type: string;
}

const ExportWalletScreen = (props:IProps) => {
    const {type} = props.route.params;

    return (
        <ExportWallet type={type} />
    )
}

export default ExportWalletScreen;