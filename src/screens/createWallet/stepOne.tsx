import React from "react";
import StepOne from "@/organisms/createWallet/stepOne";

export type CreateStepOneParams = {
    mnemonic?: any;
}

interface Props {
    route: {params: CreateStepOneParams};
}

const CreateStepOneScreen = (props:Props) => {
    const {mnemonic} = props.route.params;
   
    return (
        <StepOne mnemonic={mnemonic} />
    )
}

export default CreateStepOneScreen;

