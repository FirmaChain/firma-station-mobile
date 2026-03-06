import React, { useCallback } from 'react';
import StepTwo from '@/organisms/createWallet/stepTwo';
import { CommonActions } from '@/redux/actions';
import { useFocusEffect } from '@react-navigation/native';

interface IProps {
    route: { params: CreateStepTwoParams };
}

export type CreateStepTwoParams = {
    wallet: any;
};

const CreateStepTwoScreen = (props: IProps) => {
    const { wallet } = props.route.params;

    useFocusEffect(
        useCallback(() => {
            CommonActions.handleLoadingProgress(false);
        }, [])
    );

    return <StepTwo wallet={wallet} />;
};

export default CreateStepTwoScreen;
