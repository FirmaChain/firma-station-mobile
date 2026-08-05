import { memo } from 'react';
import Transaction from '@/organisms/transaction';

interface IProps {
    route: { params: TransactionParams };
}

export type TransactionParams = {
    // FIXME: Navigation supplies transaction payloads from multiple external signing flows.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state: any;
};

const TransactionScreen = (props: IProps) => {
    const { state } = props.route.params;
    return <Transaction state={state} />;
};

export default memo(TransactionScreen);
