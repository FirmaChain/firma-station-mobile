import React from 'react';
import NFT from '@/organisms/dapps/nft';
import { INFTProps } from '@/hooks/dapps/hooks';

interface IProps {
    route: { params: NFTParams };
}

export type NFTParams = {
    data: {
        nft: INFTProps | undefined;
        cw721Contract: string | null
    };
};

const NFTScreen = (props: IProps) => {
    const { data } = props.route.params;

    return <NFT data={data} />;
};

export default NFTScreen;
