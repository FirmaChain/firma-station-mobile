import { CommonActions } from '@/redux/actions';

import { ApiClient } from './apiClient';

export { ApiClient, ApiError, type ApiErrorKind, type ApiOptions, type ProgressController } from './apiClient';

export const createApiClient = (baseUrl?: string) =>
    new ApiClient({
        baseUrl,
        progress: {
            begin: CommonActions.beginLoadingProgress,
            end: CommonActions.endLoadingProgress
        }
    });

const apiClient = createApiClient();

export default apiClient;
