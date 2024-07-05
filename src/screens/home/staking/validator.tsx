import React from "react";
import Validator from "@/organisms/staking/validator";

interface IProps {
    route: {params: ValidatorParams};
}

export type ValidatorParams = {
    validatorAddress: string;
}

const ValidatorScreen = (props:IProps) => {
    const {validatorAddress} = props.route.params;

    return (
        <Validator validatorAddress={validatorAddress} />
    )
}

export default ValidatorScreen;