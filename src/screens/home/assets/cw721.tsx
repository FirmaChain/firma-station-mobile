import React from "react";
import CW721 from "@/organisms/wallet/cw721";

interface IProps {
    route: { params: CW721Params };
}

export type CW721Params = {
    data: {
        cw721Contract: string
    };
};

const CW721Screen = (props: IProps) => {
    const { data } = props.route.params;

    return (
        <CW721 contract={data.cw721Contract} />
    )
}

export default CW721Screen;