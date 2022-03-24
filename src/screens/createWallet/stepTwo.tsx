import React, { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { CommonActions } from "@/redux/actions";
import StepTwo from "@/organims/createWallet/stepTwo";

export type CreateStepTwoParams = {
    wallet: any;
}

interface Props {
    route: {params: CreateStepTwoParams};
}

const CreateStepTwoScreen = (props:Props) => {
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

