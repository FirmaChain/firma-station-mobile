import React from "react";
import StepThree from "@/organims/createWallet/stepThree";

export type CreateStepThreeParams = {
    wallet: any;
}

interface CreateStepThreeScreenProps {
    route: {params: CreateStepThreeParams};
}

const CreateStepThreeScreen: React.FunctionComponent<CreateStepThreeScreenProps> = (props) => {
    const {wallet} = props.route.params;

    return (
        <StepThree wallet={wallet} />
    )
}

export default CreateStepThreeScreen;

