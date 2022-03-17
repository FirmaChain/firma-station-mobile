import React from "react";
import StepOne from "@/organims/createWallet/stepOne";

export type CreateStepOneParams = {
    wallet?: any;
}

interface CreateStepOneScreenProps {
    route: {params: CreateStepOneParams};
}

const CreateStepOneScreen: React.FunctionComponent<CreateStepOneScreenProps> = (props) => {
    const {wallet} = props.route.params;
   
    return (
        <StepOne wallet={wallet} />
    )
}

export default CreateStepOneScreen;

