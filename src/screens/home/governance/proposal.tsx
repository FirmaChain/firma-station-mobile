import React from "react";
import Proposal from "@/organisms/governance/proposal";

interface IProps {
    route: {params: ProposalParams};
}

export type ProposalParams = {
    proposalId: number;
}

const ProposalScreen = (props:IProps) => {
    const {proposalId} = props.route.params;

    return (
       <Proposal proposalId={proposalId} />
    )
}

export default React.memo(ProposalScreen);