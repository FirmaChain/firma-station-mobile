import React from "react";
import StepThree from "@/organims/createWallet/stepThree";

export type CreateStepThreeParams = {
    wallet: any;
}

interface Props {
    route: {params: CreateStepThreeParams};
}

const CreateStepThreeScreen = (props:Props) => {
    const {wallet} = props.route.params;

    return (
        <StepThree walletInfo={wallet} />
    )
}

export default CreateStepThreeScreen;

