import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

interface IQueryParam {
  proposalId?: string;
  address?: string;
  offset?: number;
  limit?: number;
}

export const useBlockDataQuery = () => {
  return useQuery(
    gql`
      query {
        height: block(order_by: { height: desc }, limit: 1) {
          height
        }
        inflation {
          value
        }
        transactions: transaction_aggregate {
          aggregate {
            count
          }
        }
      }
    `,
    { pollInterval: 0, notifyOnNetworkStatusChange: true }
  );
};

export const useVotingPowerQuery = () => {
  return useQuery(
    gql`
      query {
        block(offset: 0, limit: 1, order_by: { height: desc }) {
          height
          validatorVotingPowersAggregate: validator_voting_powers_aggregate {
            aggregate {
              sum {
                votingPower: voting_power
              }
            }
          }
        }
        stakingPool: staking_pool(order_by: { height: desc }, limit: 1) {
          bonded: bonded_tokens
        }
      }
    `,
    { pollInterval: 0, notifyOnNetworkStatusChange: true }
  );
};

export const useTokenomicsQuery = () => {
  return useQuery(
    gql`
      query {
        stakingParams: staking_params(limit: 1) {
          params
        }
        stakingPool: staking_pool(order_by: { height: desc }, limit: 1) {
          bonded: bonded_tokens
          unbonded: not_bonded_tokens
        }
        supply: supply(order_by: { height: desc }, limit: 1) {
          coins
        }
      }
    `,
    { pollInterval: 0, notifyOnNetworkStatusChange: true }
  );
};

export const useValidatorsDescriptionQuery = () => {
  return useQuery(
    gql`
      query {
        validator {
          validatorInfo: validator_info {
            operatorAddress: operator_address
            selfDelegateAddress: self_delegate_address
          }
          delegations {
            amount
            delegatorAddress: delegator_address
          }
          validator_descriptions {
            avatar_url
            moniker
            details
            website
          }
        }
      }
    `,
    { pollInterval: 0, notifyOnNetworkStatusChange: true }
  );
};

// chain upgrade response
export const useValidatorsDescriptionQueryForTestNet = () => {
  return useQuery(
    gql`
      query {
        validator {
          validatorInfo: validator_info {
            operatorAddress: operator_address
            selfDelegateAddress: self_delegate_address
          }
          validator_descriptions {
            avatar_url
            moniker
            details
            website
          }
        }
      }
    `,
    { pollInterval: 0, notifyOnNetworkStatusChange: true }
  );
};

export const useDelegationsQuery = ({ address }: IQueryParam) => {
  return useQuery(
    gql`
      query ValidatorDelegations($address: String!) {
        delegations: action_validator_delegations(address: $address) {
          delegations
        }
      }
    `,
    {
      pollInterval: 0,
      notifyOnNetworkStatusChange: true,
      variables: {
        address,
      },
    }
  );
}

export const useValidatorsQuery = () => {
  return useQuery(
    gql`
      query {
        stakingPool: staking_pool(limit: 1, order_by: { height: desc }) {
          bondedTokens: bonded_tokens
        }
        average_block_time_per_day {
          average_time
        }
        average_block_time_per_hour {
          average_time
        }
        average_block_time_per_minute {
          average_time
        }
        validator {
          validatorStatuses: validator_statuses(order_by: { height: desc }, limit: 1) {
            status
            jailed
            height
          }
          delegations {
            amount
            delegatorAddress: delegator_address
          }
          validatorSigningInfos: validator_signing_infos(order_by: { height: desc }, limit: 1) {
            missedBlocksCounter: missed_blocks_counter
          }
          validatorInfo: validator_info {
            operatorAddress: operator_address
            selfDelegateAddress: self_delegate_address
          }
          validatorVotingPowers: validator_voting_powers(offset: 0, limit: 1, order_by: { height: desc }) {
            votingPower: voting_power
          }
          validatorCommissions: validator_commissions(order_by: { height: desc }, limit: 1) {
            commission
          }
          validatorSigningInfos: validator_signing_infos(order_by: { height: desc }, limit: 1) {
            missedBlocksCounter: missed_blocks_counter
            tombstoned
          }
          validator_descriptions {
            avatar_url
            moniker
            details
            website
          }
        }
        slashingParams: slashing_params(order_by: { height: desc }, limit: 1) {
          params
        }
        inflation {
          value
        }
        supply {
          coins
        }
      }
    `,
    { pollInterval: 0, notifyOnNetworkStatusChange: true }
  );
};

// chain upgrade response
export const useValidatorsQueryForTestNet = () => {
  return useQuery(
    gql`
      query {
        stakingPool: staking_pool(limit: 1, order_by: { height: desc }) {
          bondedTokens: bonded_tokens
        }
        average_block_time_per_day {
          average_time
        }
        average_block_time_per_hour {
          average_time
        }
        average_block_time_per_minute {
          average_time
        }
        validator {
          validatorStatuses: validator_statuses(order_by: { height: desc }, limit: 1) {
            status
            jailed
            height
          }
          validatorSigningInfos: validator_signing_infos(order_by: { height: desc }, limit: 1) {
            missedBlocksCounter: missed_blocks_counter
          }
          validatorInfo: validator_info {
            operatorAddress: operator_address
            selfDelegateAddress: self_delegate_address
          }
          validatorVotingPowers: validator_voting_powers(offset: 0, limit: 1, order_by: { height: desc }) {
            votingPower: voting_power
          }
          validatorCommissions: validator_commissions(order_by: { height: desc }, limit: 1) {
            commission
          }
          validatorSigningInfos: validator_signing_infos(order_by: { height: desc }, limit: 1) {
            missedBlocksCounter: missed_blocks_counter
            tombstoned
          }
          validator_descriptions {
            avatar_url
            moniker
            details
            website
          }
        }
        slashingParams: slashing_params(order_by: { height: desc }, limit: 1) {
          params
        }
        inflation {
          value
        }
        supply {
          coins
        }
      }
    `,
    { pollInterval: 0, notifyOnNetworkStatusChange: true }
  );
};

export const useValidatorFromAddressQuery = ({ address }: IQueryParam) => {
  return useQuery(
    gql`
      {
        stakingPool: staking_pool(limit: 1, order_by: {height: desc}) {
          bondedTokens: bonded_tokens
        }
        average_block_time_per_day {
          average_time
        }
        average_block_time_per_hour {
          average_time
        }
        average_block_time_per_minute {
          average_time
        }
        validator(where: {validator_info: {operator_address: {_eq: ${address}}}}) {
          validatorStatuses: validator_statuses(order_by: {height: desc}, limit: 1) {
            status
            jailed
            height
          }
          delegations {
            amount
            delegatorAddress: delegator_address
          }
          validatorSigningInfos: validator_signing_infos(order_by: {height: desc}, limit: 1) {
            missedBlocksCounter: missed_blocks_counter
          }
          validatorInfo: validator_info {
            operatorAddress: operator_address
            selfDelegateAddress: self_delegate_address
          }
          validatorVotingPowers: validator_voting_powers(offset: 0, limit: 1, order_by: {height: desc}) {
            votingPower: voting_power
          }
          validatorCommissions: validator_commissions(order_by: {height: desc}, limit: 1) {
            commission
          }
          validatorSigningInfos: validator_signing_infos(order_by: {height: desc}, limit: 1) {
            missedBlocksCounter: missed_blocks_counter
            tombstoned
          }
          validator_descriptions {
            avatar_url
            moniker
            details
            website
          }
        }
        slashingParams: slashing_params(order_by: {height: desc}, limit: 1) {
          params
        }
        inflation {
          value
        }
        supply {
          coins
        }
      }
    `,
    { pollInterval: 0, notifyOnNetworkStatusChange: true }
  );
};

// chain upgrade response
export const useValidatorFromAddressQueryForTestNet = ({ address }: IQueryParam) => {
  return useQuery(
    gql`
      {
        stakingPool: staking_pool(limit: 1, order_by: {height: desc}) {
          bondedTokens: bonded_tokens
        }
        average_block_time_per_day {
          average_time
        }
        average_block_time_per_hour {
          average_time
        }
        average_block_time_per_minute {
          average_time
        }
        validator(where: {validator_info: {operator_address: {_eq: ${address}}}}) {
          validatorStatuses: validator_statuses(order_by: {height: desc}, limit: 1) {
            status
            jailed
            height
          }
          validatorSigningInfos: validator_signing_infos(order_by: {height: desc}, limit: 1) {
            missedBlocksCounter: missed_blocks_counter
          }
          validatorInfo: validator_info {
            operatorAddress: operator_address
            selfDelegateAddress: self_delegate_address
          }
          validatorVotingPowers: validator_voting_powers(offset: 0, limit: 1, order_by: {height: desc}) {
            votingPower: voting_power
          }
          validatorCommissions: validator_commissions(order_by: {height: desc}, limit: 1) {
            commission
          }
          validatorSigningInfos: validator_signing_infos(order_by: {height: desc}, limit: 1) {
            missedBlocksCounter: missed_blocks_counter
            tombstoned
          }
          validator_descriptions {
            avatar_url
            moniker
            details
            website
          }
        }
        slashingParams: slashing_params(order_by: {height: desc}, limit: 1) {
          params
        }
        inflation {
          value
        }
        supply {
          coins
        }
      }
    `,
    { pollInterval: 0, notifyOnNetworkStatusChange: true }
  );
};


export const useGovernmentQuery = () => {
  return useQuery(
    gql`
      query {
        proposals: proposal(order_by: { id: desc }) {
          title
          proposalId: id
          status
          description
          proposalType: proposal_type
          depositEndTime: deposit_end_time
          votingStartTime: voting_start_time
          votingEndTime: voting_end_time
        }
      }
    `,
    { pollInterval: 0, notifyOnNetworkStatusChange: true }
  );
};

export const useProposalQuery = ({ proposalId }: IQueryParam) => {
  return useQuery(
    gql`
      query {
        proposal (where: {id: {_eq: ${proposalId}}}) {
          title
          description
          status
          content
          proposalId: id
          submitTime: submit_time
          depositEndTime: deposit_end_time
          votingStartTime: voting_start_time
          votingEndTime: voting_end_time
          proposalDeposits: proposal_deposits {
            amount
            depositorAddress: depositor_address
          }
          staking_pool_snapshot {
            bonded_tokens
          }
        }
        govParams: gov_params (limit: 1, order_by: {height: desc}) {
          depositParams: deposit_params
          tallyParams: tally_params
          votingParams: voting_params
        }
        proposalVote: proposal_vote(where: {proposal_id: {_eq:  ${proposalId}}}) {
          option
          voterAddress: voter_address
        }
        stakingPool: staking_pool(limit: 1, order_by: { height: desc }) {
          totalVotingPower: bonded_tokens
        }
        proposalTallyResult: proposal_tally_result(where: {proposal_id: {_eq: ${proposalId}}}) {
          yes
          no
          noWithVeto: no_with_veto
          abstain
        }
      }
    `,
    { pollInterval: 0, notifyOnNetworkStatusChange: true }
  );
};

export const useHistoryByAddressQuery = ({ address, offset, limit }: IQueryParam) => {
  return useQuery(
    gql`
      query GetMessagesByAddress($address: _text, $limit: bigint = 50, $offset: bigint = 0, $types: _text = "{}") {
        messagesByAddress: messages_by_address(
          args: { addresses: $address, types: $types, limit: $limit, offset: $offset }, order_by: {transaction: {block: {height: desc}}}
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
      pollInterval: 0,
      notifyOnNetworkStatusChange: true,
      variables: {
        address,
        limit,
        offset,
      },
    }
  );
};

export const useVersion = () => {
  return useQuery(
    gql`
      query {
        version {
          chainVer
          sdkVer
        }
      }
    `,
    {
      pollInterval: 0,
      notifyOnNetworkStatusChange: true,
      variables: {
        limit: 99999,
      },
    }
  )
}


export const useMaintenance = () => {
  return useQuery(
    gql`
      query {
        maintenance(order_by: {index: desc}) {
          maintenance
          currentAppVer
          minAppVer
        }
      }
    `,
    {
      pollInterval: 0,
      notifyOnNetworkStatusChange: true,
      variables: {
        limit: 99999,
      },
    }
  )
}
