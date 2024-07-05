import React, { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { CommonActions } from "@/redux/actions";
import StepTwo from "@/organisms/createWallet/stepTwo";

interface IProps {
    route: {params: CreateStepTwoParams};
}

export type CreateStepTwoParams = {
    wallet: any;
}

const CreateStepTwoScreen = (props:IProps) => {
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

