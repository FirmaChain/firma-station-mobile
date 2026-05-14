import React, { useCallback } from 'react';
import StepTwo from '@/organisms/createWallet/stepTwo';
import { CommonActions } from '@/redux/actions';
import { useFocusEffect } from '@react-navigation/native';

interface IProps {
    route: { params: CreateStepTwoParams };
}

export type CreateStepTwoParams = {
    wallet: any;
    loadingRequestId?: string;
};

const CreateStepTwoScreen = (props: IProps) => {
    const { wallet, loadingRequestId } = props.route.params;

    useFocusEffect(
        useCallback(() => {
            CommonActions.endLoadingProgress(loadingRequestId);
        }, [loadingRequestId])
    );

    return <StepTwo wallet={wallet} />;
};

export default CreateStepTwoScreen;
