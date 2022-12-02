import React from 'react';
import StepOne from '@/organisms/createWallet/stepOne';

interface IProps {
    route: { params: CreateStepOneParams };
}

export type CreateStepOneParams = {
    recoverValue?: any;
};

const CreateStepOneScreen = (props: IProps) => {
    const { recoverValue } = props.route.params;

    return <StepOne recoverValue={recoverValue} />;
};

export default CreateStepOneScreen;
