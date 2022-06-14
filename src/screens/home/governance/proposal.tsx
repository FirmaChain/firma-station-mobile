import React from "react";
import Proposal from "@/organisms/governance/proposal";

export type ProposalParams = {
    proposalId: number;
}

interface Props {
    route: {params: ProposalParams};
}

const ProposalScreen = (props:Props) => {
    const {proposalId} = props.route.params;

    return (
       <Proposal proposalId={proposalId} />
    )
}

export default React.memo(ProposalScreen);