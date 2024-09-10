import { preprocessComment } from '../preprocessComment';

describe('preprocessComment', () => {
    it('should replace more than two consecutive newlines with exactly two newlines', () => {
        const input = 'line1\n\n\nline2\n\n\n\nline3';
        const expected = 'line1\n\nline2\n\nline3';
        expect(preprocessComment(input)).toBe(expected);
    });

    it('should limit the total number of lines to a maximum of 10', () => {
        const input = 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10\nline11';
        const expected = 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10';
        expect(preprocessComment(input)).toBe(expected);
    });

    it('should handle an empty string', () => {
        const input = '';
        const expected = '';
        expect(preprocessComment(input)).toBe(expected);
    });

    it('should handle a string with no newlines', () => {
        const input = 'line1 line2 line3';
        const expected = 'line1 line2 line3';
        expect(preprocessComment(input)).toBe(expected);
    });

    it('should handle a string with exactly two newlines', () => {
        const input = 'line1\n\nline2';
        const expected = 'line1\n\nline2';
        expect(preprocessComment(input)).toBe(expected);
    });

    it('should handle a string with multiple spaces', () => {
        const input = 'line1   line2    line3';
        const expected = 'line1  line2  line3';
        expect(preprocessComment(input)).toBe(expected);
    });

    it('should handle a string with multiple spaces and newlines', () => {
        const input = 'line1   \n\n\nline2    \n\n\n\nline3';
        const expected = 'line1  \n\nline2  \n\nline3';
        expect(preprocessComment(input)).toBe(expected);
    });
});