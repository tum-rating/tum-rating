import {baseFetch} from './baseFetch';

import {getOrCreateTraceId} from '@/utils/getOrCreateTraceId';

export async function fetchWithServices(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const traceId = getOrCreateTraceId();
    const headers = new Headers(init?.headers);
    headers.set('x-trace-id', traceId);

    const modifiedInit = {
        ...init,
        headers,
    };

    return baseFetch(input, modifiedInit);
}
