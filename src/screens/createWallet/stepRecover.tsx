import React from 'react';
import StepRecover from '@/organisms/createWallet/stepRecover';

interface IProps {
    route: { params: CreateStepRecoverParams };
}

export type CreateStepRecoverParams = {
    type: 'mnemonic' | 'privateKey';
};

const StepRecoverScreen = (props: IProps) => {
    const { type } = props.route.params;
    return <StepRecover type={type} />;
};

export default StepRecoverScreen;
