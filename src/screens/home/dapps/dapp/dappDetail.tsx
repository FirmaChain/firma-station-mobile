import React from 'react';
import DappDetail from '@/organisms/dapps/dappDetail';
import { useDappsContext } from '@/context/dappsContext';

const DappDetailScreen = () => {
    const { data } = useDappsContext()

    return <DappDetail data={data} />;
};

export default DappDetailScreen;
