import {v4 as uuidv4} from 'uuid';

export function getOrCreateTraceId(): string {
    let traceId = localStorage.getItem('x-trace-id');
    if (!traceId) {
        traceId = uuidv4();
        localStorage.setItem('x-trace-id', traceId);
    }
    return traceId;
}
