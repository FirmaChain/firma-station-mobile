import Web from "@/organims/web/web";
import React from "react";

export type WebParams = {
    uri: any;
}

interface Props {
    route: {params: WebParams};
}


const WebScreen = (props:Props) => {
    const {uri} = props.route.params;
    return (
        <Web uri={uri}/>
    )
}

export default React.memo(WebScreen);