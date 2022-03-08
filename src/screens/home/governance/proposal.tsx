import React from "react";
import Proposal from "@/organims/governance/proposal";

export type ProposalParams = {
    proposalId: number;
}

interface ProposalScreenProps {
    route: {params: ProposalParams};
}

const ProposalScreen: React.FunctionComponent<ProposalScreenProps> = (props) => {
    const {proposalId} = props.route.params;

    return (
       <Proposal proposalId={proposalId} />
    )
}

export default React.memo(ProposalScreen);