import { memo } from 'react';
import Delegate from '@/organisms/staking/delegate';

interface IProps {
    route: { params: DelegateParams };
}

export type DelegateParams = {
    // FIXME: Navigation supplies delegation payloads from external chain modules.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state: any;
};

const DelegateScreen = (props: IProps) => {
    const { state } = props.route.params;
    return <Delegate type={state.type} operatorAddress={state.operatorAddress} />;
};

export default memo(DelegateScreen);
