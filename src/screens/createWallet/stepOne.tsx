import React from "react";
import StepOne from "@/organisms/createWallet/stepOne";

interface IProps {
    route: {params: CreateStepOneParams};
}

export type CreateStepOneParams = {
    mnemonic?: any;
}

const CreateStepOneScreen = (props:IProps) => {
    const {mnemonic} = props.route.params;
   
    return (
        <StepOne mnemonic={mnemonic} />
    )
}

export default CreateStepOneScreen;

