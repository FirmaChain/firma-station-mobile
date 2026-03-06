import React from 'react';
import SendIBC from '@/organisms/wallet/sendIBC';
import { IBCDataState } from '@/organisms/wallet/wallet';

export type SendIBCParams = {
    tokenData: IBCDataState;
};

interface IProps {
    route: { params: SendIBCParams };
}

const SendIBCScreen = (props: IProps) => {
    const { tokenData } = props.route.params;
    return <SendIBC tokenData={tokenData} />;
};

export default SendIBCScreen;
