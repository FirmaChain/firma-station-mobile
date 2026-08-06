import ky, { isHTTPError, isNetworkError, isTimeoutError, type Input, type KyInstance, type Options } from 'ky';

export type ApiErrorKind = 'client' | 'http' | 'network' | 'parse' | 'server';

const isSyntaxError = (error: unknown): boolean =>
    typeof error === 'object' && error !== null && 'name' in error && error.name === 'SyntaxError';

export class ApiError extends Error {
    readonly name = 'ApiError';

    constructor(
        readonly kind: ApiErrorKind,
        message: string,
        readonly status?: number
    ) {
        super(message);
    }

    static from(error: unknown): ApiError {
        if (error instanceof ApiError) return error;
        if (isHTTPError(error)) return ApiError.fromStatus(error.response.status);
        if (isSyntaxError(error)) {
            return new ApiError('parse', 'The server returned invalid JSON.');
        }
        if (isNetworkError(error) || isTimeoutError(error) || error instanceof TypeError || error instanceof DOMException) {
            return new ApiError('network', error.message);
        }
        if (error instanceof Error) return new ApiError('client', error.message);
        return new ApiError('network', 'The request could not reach the server.');
    }

    static fromStatus(status: number): ApiError {
        return new ApiError('http', `The server returned HTTP ${status}.`, status);
    }

    static fromServer(message: string): ApiError {
        return new ApiError('server', message);
    }
}

export type ApiContext = {
    readonly disableProgress?: boolean;
};

export type ApiOptions = Options & {
    readonly context?: ApiContext;
};

export type ProgressController = {
    readonly begin: () => string;
    readonly end: (requestId: string) => void;
};

type ApiClientOptions = {
    readonly baseUrl?: string;
    readonly client?: KyInstance;
    readonly progress?: ProgressController;
    readonly retryLimit?: number;
    readonly timeout?: number;
};

export class ApiClient {
    private readonly client: KyInstance;

    constructor(private readonly options: ApiClientOptions = {}) {
        this.client =
            options.client ??
            ky.create({
                prefix: options.baseUrl,
                retry: { limit: options.retryLimit ?? 0 },
                throwHttpErrors: true,
                timeout: options.timeout ?? 30_000
            });
    }

    async getJson<T>(url: Input, options?: ApiOptions): Promise<T> {
        return this.requestJson<T>(url, { ...options, method: 'get' });
    }

    async postJson<T>(url: Input, options?: ApiOptions): Promise<T> {
        return this.requestJson<T>(url, { ...options, method: 'post' });
    }

    async putJson<T>(url: Input, options?: ApiOptions): Promise<T> {
        return this.requestJson<T>(url, { ...options, method: 'put' });
    }

    private async requestJson<T>(url: Input, options: ApiOptions): Promise<T> {
        const context = options.context ?? {};
        const requestId = context.disableProgress ? undefined : this.options.progress?.begin();

        try {
            const response = await this.client(url, { ...options, throwHttpErrors: true });

            return await response.json<T>();
        } catch (error) {
            throw ApiError.from(error);
        } finally {
            if (requestId) this.options.progress?.end(requestId);
        }
    }
}
