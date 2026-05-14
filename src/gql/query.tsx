import { requestGraphQL } from '@/gql';

type ProposalDataResponse = {
    proposal: Array<{
        staking_pool_snapshot?: {
            bonded_tokens?: number | string;
        } | null;
    }>;
    proposalVote: Array<{
        option: string;
        voterAddress: string;
        height: number;
    }>;
};

type HistoryByAddressResponse = {
    messagesByAddress: Array<{
        transaction: {
            height: number;
            hash: string;
            success: boolean;
            messages: unknown;
            block: {
                height: number;
                timestamp: string;
            };
        };
    }>;
};

export const getProposalData = async ({ proposalId, network }: { proposalId?: string; network: string }): Promise<ProposalDataResponse> => {
    if (proposalId === undefined || proposalId === null || proposalId === '') {
        throw new Error('proposalId is required');
    }

    const parsedProposalId = Number(proposalId);

    if (Number.isNaN(parsedProposalId)) {
        throw new Error('proposalId must be a number');
    }

    return await requestGraphQL<ProposalDataResponse, { proposalId: number }>(
        network,
        `
        query GetProposalData($proposalId: Int) {
            proposal(where: {id: {_eq: $proposalId}}) {
                staking_pool_snapshot {
                    bonded_tokens
                }
            }
            proposalVote: proposal_vote(
                where: {proposal_id: {_eq: $proposalId}}
                order_by: {height: asc}
            ) {
                option
                voterAddress: voter_address
                height
            }
        }
        `,
        { proposalId: parsedProposalId }
    );
};

export const getHistoryByAddressData = async ({
    address,
    offset,
    limit,
    network
}: {
    address?: string;
    offset?: number;
    limit?: number;
    network: string;
}): Promise<HistoryByAddressResponse> => {
    return await requestGraphQL<HistoryByAddressResponse, { address?: string; limit?: number; offset?: number }>(
        network,
        `
            query GetMessagesByAddress($address: _text, $limit: bigint = 50, $offset: bigint = 0, $types: _text = "{}") {
                messagesByAddress: messages_by_address(
                    args: { addresses: $address, types: $types, limit: $limit, offset: $offset }
                    order_by: { transaction: { block: { height: desc } } }
                ) {
                    transaction {
                        height
                        hash
                        success
                        messages
                        block {
                            height
                            timestamp
                        }
                    }
                }
            }
        `,
        {
            address,
            limit,
            offset
        }
    );
};
