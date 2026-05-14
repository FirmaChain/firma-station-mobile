import { CHAIN_NETWORK } from '@/../config';
import kyInstance, { type ApiOptions } from '@/util/kyService';

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

async function parseGraphQLResponse<TData>(response: Response): Promise<GraphQLResponse<TData>> {
    const raw = await response.text();

    if (!raw) {
        return {};
    }

    try {
        return JSON.parse(raw) as GraphQLResponse<TData>;
    } catch {
        throw new Error(`Invalid GraphQL response: ${raw.slice(0, 200)}`);
    }
}

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
        throwHttpErrors: false
    };

    const response = await kyInstance.post(getGraphQLEndpoint(network), requestOptions);
    const payload = await parseGraphQLResponse<TData>(response);

    if (payload.errors?.length) {
        throw new Error(payload.errors[0]?.message ?? 'GraphQL request failed');
    }

    if (!response.ok && payload.data === undefined) {
        throw new Error(`GraphQL request failed with status ${response.status}`);
    }

    if (payload.data === undefined) {
        throw new Error('GraphQL response did not contain data');
    }

    return payload.data;
}
