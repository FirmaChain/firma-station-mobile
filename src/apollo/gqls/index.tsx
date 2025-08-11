import gql from 'graphql-tag';
import { getClient } from '@/apollo';

interface IQueryParam {
    proposalId?: string;
    address?: string;
    offset?: number;
    limit?: number;
}

export const getProposalData = async ({ proposalId }: IQueryParam) => {
    return await getClient().query({
        query: gql`
        query {
            proposal (where: {id: {_eq: ${proposalId}}}) {
              staking_pool_snapshot {
                bonded_tokens
              }
            }
            proposalVote: proposal_vote(
                where: {proposal_id: {_eq: ${proposalId}}}
                order_by: {height: asc}
            ) {
                option
                voterAddress: voter_address
                height
            }
          }
        `,
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'no-cache',
    });
};

export const getHistoryByAddressData = async ({ address, offset, limit }: IQueryParam) => {
    return await getClient().query({
        query: gql`
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
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'no-cache',
        variables: {
            address,
            limit,
            offset,
        },
    });
};
