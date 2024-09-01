import { getOrCreateTraceId } from '@/utils/getOrCreateTraceId';

describe('getOrCreateTraceId', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should return existing trace ID from localStorage', () => {
        const existingTraceId = 'existing-trace-id';
        localStorage.setItem('x-trace-id', existingTraceId);
        const traceId = getOrCreateTraceId();
        expect(traceId).toBe(existingTraceId);
    });

    it('should create a new trace ID if none exists in localStorage', () => {
        const traceId = getOrCreateTraceId();
        expect(traceId).toBeDefined();
        expect(localStorage.getItem('x-trace-id')).toBe(traceId);
    });

    it('should return a valid UUID as the trace ID', () => {
        const traceId = getOrCreateTraceId();
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        expect(traceId).toMatch(uuidRegex);
    });

    it('should create a new trace ID if localStorage is cleared', () => {
        const initialTraceId = getOrCreateTraceId();
        localStorage.clear();
        const newTraceId = getOrCreateTraceId();
        expect(newTraceId).not.toBe(initialTraceId);
    });
});