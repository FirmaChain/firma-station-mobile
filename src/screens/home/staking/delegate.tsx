import React from "react";
import Delegate from "@/organisms/staking/delegate";

export type DelegateParams = {
    state: any;
}

interface Props {
    route: {params: DelegateParams};
}

const DelegateScreen = (props:Props) => {
    const {state} = props.route.params;
    return (
        <Delegate type={state.type} operatorAddress={state.operatorAddress} />
    )
}

export default React.memo(DelegateScreen);