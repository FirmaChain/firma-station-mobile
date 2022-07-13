import React from "react";
import Web from "@/organisms/web/web";

interface IProps {
    route: {params: WebParams};
}

export type WebParams = {
    uri: any;
}

const WebScreen = (props:IProps) => {
    const {uri} = props.route.params;
    return (
        <Web uri={uri}/>
    )
}

export default React.memo(WebScreen);