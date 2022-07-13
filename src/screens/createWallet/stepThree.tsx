import React from "react";
import StepThree from "@/organisms/createWallet/stepThree";

interface IProps {
    route: {params: CreateStepThreeParams};
}

export type CreateStepThreeParams = {
    wallet: any;
}

const CreateStepThreeScreen = (props:IProps) => {
    const {wallet} = props.route.params;

    return (
        <StepThree walletInfo={wallet} />
    )
}

export default CreateStepThreeScreen;

