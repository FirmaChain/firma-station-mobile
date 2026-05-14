import { CommonActions } from '@/redux/actions';
import ky, { type AfterResponseHook, type BeforeErrorHook, type BeforeRequestHook, type KyInstance, type Options } from 'ky';

import { getRandomKey } from './keystore';

type ApiContext = {
    requestId?: string;
    disableProgress?: boolean;
};

export type ApiOptions = Options & {
    context?: ApiContext;
};

const beforeRequest: BeforeRequestHook = ({ options }) => {
    const context = options.context as ApiContext;

    // Do not touch when progress is disabled
    if (context.disableProgress) {
        return;
    }

    const requestId = getRandomKey();

    context.requestId = requestId;

    CommonActions.setRequestId(requestId);
};

const afterResponse: AfterResponseHook = ({ options, response }) => {
    const context = options.context as ApiContext;

    if (context.requestId) {
        CommonActions.clearRequestId(context.requestId);
    }

    return response;
};

const beforeError: BeforeErrorHook = ({ error, options }) => {
    const context = options.context as ApiContext;

    if (context.requestId) {
        CommonActions.clearRequestId(context.requestId);
    }

    return error;
};

const kyInstance: KyInstance = ky.create({
    timeout: 30000,

    hooks: {
        beforeRequest: [beforeRequest],
        afterResponse: [afterResponse],
        beforeError: [beforeError]
    }
});

export default kyInstance;
