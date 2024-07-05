import React from "react";
import SendCW721 from "@/organisms/dapps/sendCW721";

interface IProps {
    route: { params: SendCW721Params };
}

export type SendCW721Params = {
    contract: string;
    imageURL: string;
    nftName: string;
    tokenId: string;
}


const SendCW721Screen = (props: IProps) => {
    const { contract, imageURL, nftName, tokenId } = props.route.params;

    return (
        <SendCW721 contract={contract} imageURL={imageURL} nftName={nftName} tokenId={tokenId} />
    )
}

export default React.memo(SendCW721Screen);