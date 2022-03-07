import React, { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { CommonActions } from "@/redux/actions";
import StepTwo from "@/organims/createWallet/stepTwo";

export type CreateStepTwoParams = {
    wallet: any;
}

interface CreateStepTwoScreenProps {
    route: {params: CreateStepTwoParams};
}

const CreateStepTwoScreen: React.FunctionComponent<CreateStepTwoScreenProps> = (props) => {
    const {wallet} = props.route.params;

    useFocusEffect(
        useCallback(() => {
            CommonActions.handleLoadingProgress(false);
        }, [])
    )

    return (
        <StepTwo wallet={wallet} />
    )
}

export default CreateStepTwoScreen;

