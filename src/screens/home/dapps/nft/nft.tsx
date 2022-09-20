import React from 'react';
import NFT from '@/organisms/dapps/nft';

interface IProps {
    route: { params: NFTParams };
}

export type NFTParams = {
    data: any;
};

const NFTScreen = (props: IProps) => {
    const { data } = props.route.params;

    return <NFT data={data} />;
};

export default NFTScreen;
