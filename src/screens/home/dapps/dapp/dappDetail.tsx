import React from 'react';
import { useDappsContext } from '@/context/dappsContext';
import DappDetail from '@/organisms/dapps/dappDetail';

const DappDetailScreen = () => {
    const { data } = useDappsContext();

    return <DappDetail data={data} />;
};

export default DappDetailScreen;
