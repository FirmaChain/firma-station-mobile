import React from "react";
import ExportWallet from "@/organims/setting/exportWallet";


export type ExportWalletParams = {
    type: string;
}

interface ExportWalletProps {
    route: {params: ExportWalletParams};
}

const ExportWalletScreen = (props:ExportWalletProps) => {
    const {type} = props.route.params;

    return (
        <ExportWallet type={type} />
    )
}

export default ExportWalletScreen;