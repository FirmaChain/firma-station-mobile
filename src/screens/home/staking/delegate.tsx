import React from "react";
import Delegate from "@/organisms/staking/delegate";

interface IProps {
    route: {params: DelegateParams};
}

export type DelegateParams = {
    state: any;
}

const DelegateScreen = (props:IProps) => {
    const {state} = props.route.params;
    return (
        <Delegate type={state.type} operatorAddress={state.operatorAddress} />
    )
}

export default React.memo(DelegateScreen);