import {preprocessComment} from '../preprocessComment';

describe('preprocessComment', () => {
    it('should replace three or more consecutive newlines with two newlines', () => {
        const input = 'line1\n\n\nline2';
        const expected = 'line1\n\nline2';
        expect(preprocessComment(input)).toBe(expected);
    });

    it('should handle a string with no newlines', () => {
        const input = 'line1 line2 line3';
        const expected = 'line1 line2 line3';
        expect(preprocessComment(input)).toBe(expected);
    });

    it('should handle a string with exactly two consecutive newlines', () => {
        const input = 'line1\n\nline2';
        const expected = 'line1\n\nline2';
        expect(preprocessComment(input)).toBe(expected);
    });

    it('should handle an empty string', () => {
        const input = '';
        const expected = '';
        expect(preprocessComment(input)).toBe(expected);
    });

    it('should handle a string with multiple sets of three or more consecutive newlines', () => {
        const input = 'line1\n\n\nline2\n\n\n\nline3';
        const expected = 'line1\n\nline2\n\nline3';
        expect(preprocessComment(input)).toBe(expected);
    });
});
