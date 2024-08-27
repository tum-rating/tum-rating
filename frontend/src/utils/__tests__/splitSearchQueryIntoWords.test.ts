import {splitSearchQueryIntoWords} from '@/utils/splitSearchQueryIntoWords.ts';

describe('splitSearchQueryIntoWords', () => {
    it('should split a query with spaces into words', () => {
        const result = splitSearchQueryIntoWords('hello world');
        expect(result).toEqual(['hello', 'world']);
    });

    it('should split a query with commas into words', () => {
        const result = splitSearchQueryIntoWords('hello,world');
        expect(result).toEqual(['hello', 'world']);
    });

    it('should split a query with periods into words', () => {
        const result = splitSearchQueryIntoWords('hello.world');
        expect(result).toEqual(['hello', 'world']);
    });

    it('should split a query with hyphens into words', () => {
        const result = splitSearchQueryIntoWords('hello-world');
        expect(result).toEqual(['hello', 'world']);
    });

    it('should handle a query with multiple separators', () => {
        const result = splitSearchQueryIntoWords('hello, world. how-are you');
        expect(result).toEqual(['hello', 'world', 'how', 'are', 'you']);
    });

    it('should handle a query with leading and trailing separators', () => {
        const result = splitSearchQueryIntoWords(' hello, world. ');
        expect(result).toEqual(['hello', 'world']);
    });

    it('should handle an empty query', () => {
        const result = splitSearchQueryIntoWords('');
        expect(result).toEqual([]);
    });

    it('should handle a query with only separators', () => {
        const result = splitSearchQueryIntoWords(' ,.-');
        expect(result).toEqual([]);
    });
});
