import React from "react";
import Validator from "@/organisms/staking/validator";


export type ValidatorParams = {
    validatorAddress: string;
}

interface Props {
    route: {params: ValidatorParams};
}

const ValidatorScreen = (props:Props) => {
    const {validatorAddress} = props.route.params;

    return (
        <Validator validatorAddress={validatorAddress} />
    )
}

export default ValidatorScreen;