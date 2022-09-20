import React from 'react';
import DappDetail from '@/organisms/dapps/dappDetail';

interface IProps {
    route: { params: DappDetailParams };
}

export type DappDetailParams = {
    data: any;
};

const DappDetailScreen = (props: IProps) => {
    const { data } = props.route.params;

    return <DappDetail data={data} />;
};

export default DappDetailScreen;
