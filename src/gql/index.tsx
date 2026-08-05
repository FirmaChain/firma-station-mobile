import { CHAIN_NETWORK } from '@/../config';
import apiClient, { ApiError, type ApiOptions } from '@/util/kyService';

type GraphQLError = {
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
    extensions?: Record<string, unknown>;
};

type GraphQLResponse<TData> = {
    data?: TData;
    errors?: GraphQLError[];
};

export const getGraphQLEndpoint = (network: string) => CHAIN_NETWORK[network].GRAPHQL + '/v1/graphql';

export async function requestGraphQL<TData, TVariables extends Record<string, unknown> | undefined = undefined>(
    network: string,
    query: string,
    variables?: TVariables
): Promise<TData> {
    const requestOptions: ApiOptions = {
        json: variables === undefined ? { query } : { query, variables },
        context: {
            disableProgress: true
        },
        retry: { limit: 0 }
    };

    const payload = await apiClient.postJson<GraphQLResponse<TData>>(getGraphQLEndpoint(network), requestOptions);

    if (payload.errors?.length) {
        throw ApiError.fromServer(payload.errors[0]?.message ?? 'GraphQL request failed.');
    }

    if (payload.data === undefined) {
        throw ApiError.fromServer('GraphQL response did not contain data.');
    }

    return payload.data;
}
