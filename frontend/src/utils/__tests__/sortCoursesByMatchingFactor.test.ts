import {Course} from '@/courses/types.ts';
import {sortCoursesByMatchingFactor} from '@/utils/sortCoursesByMatchingFactor.ts';

describe('sortCoursesByMatchingFactor', () => {
    const courses: Course[] = [
        {
            _id: '1',
            name: 'Introduction to Programming',
            professor: 'John Doe',
            courseId: 'CSE101',
            courseNumber: '101',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-02',
            howInterestingRatingAverage: 4.5,
            howEasyRatingAverage: 3.8,
            votesNumber: 100,
            offeredInSemesters: ['Fall 2023', 'Spring 2024'],
        },
        {
            _id: '2',
            name: 'Advanced Mathematics',
            professor: 'Jane Smith',
            courseId: 'MATH201',
            courseNumber: '201',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-02',
            howInterestingRatingAverage: 4.0,
            howEasyRatingAverage: 3.5,
            votesNumber: 80,
            offeredInSemesters: ['Fall 2023', 'Spring 2024'],
        },
        {
            _id: '3',
            name: 'Physics 101',
            professor: 'Albert Einstein',
            courseId: 'PHYS101',
            courseNumber: '101',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-02',
            howInterestingRatingAverage: 4.7,
            howEasyRatingAverage: 3.9,
            votesNumber: 90,
            offeredInSemesters: ['Fall 2023', 'Spring 2024'],
        },
    ];

    it('should return courses sorted by matching factor for exact match in name', () => {
        const result = sortCoursesByMatchingFactor(courses, 'Introduction to Programming');
        expect(result[0].name).toBe('Introduction to Programming');
    });

    it('should return courses sorted by matching factor for exact match in professor', () => {
        const result = sortCoursesByMatchingFactor(courses, 'John Doe');
        expect(result[0].professor).toBe('John Doe');
    });

    it('should return courses sorted by matching factor for partial match in name', () => {
        const result = sortCoursesByMatchingFactor(courses, 'Programming');
        expect(result[0].name).toBe('Introduction to Programming');
    });

    it('should return courses sorted by matching factor for partial match in professor', () => {
        const result = sortCoursesByMatchingFactor(courses, 'Einstein');
        expect(result[0].professor).toBe('Albert Einstein');
    });

    it('should return courses sorted by matching factor for multiple words in search query', () => {
        const result = sortCoursesByMatchingFactor(courses, 'Advanced Mathematics Jane');
        expect(result[0].name).toBe('Advanced Mathematics');
    });

    it('should return all courses when no courses match the search query', () => {
        const result = sortCoursesByMatchingFactor(courses, 'Biology');
        expect(result).toHaveLength(3);
    });

    it('should handle case insensitivity in search query', () => {
        const result = sortCoursesByMatchingFactor(courses, 'introduction to programming');
        expect(result[0].name).toBe('Introduction to Programming');
    });

    it('should handle empty search query', () => {
        const result = sortCoursesByMatchingFactor(courses, '');
        expect(result).toHaveLength(3);
    });

    it('should handle courses with empty name and professor fields', () => {
        const coursesWithEmptyFields: Course[] = [
            {
                _id: '1',
                name: '',
                professor: '',
                courseId: '',
                courseNumber: '',
                createdAt: '',
                updatedAt: '',
                howInterestingRatingAverage: 0,
                howEasyRatingAverage: 0,
                votesNumber: 0,
                offeredInSemesters: [],
            },
            {
                _id: '2',
                name: 'Advanced Mathematics',
                professor: 'Jane Smith',
                courseId: 'MATH201',
                courseNumber: '201',
                createdAt: '2023-01-01',
                updatedAt: '2023-01-02',
                howInterestingRatingAverage: 4.0,
                howEasyRatingAverage: 3.5,
                votesNumber: 80,
                offeredInSemesters: ['Fall 2023', 'Spring 2024'],
            },
        ];
        const result = sortCoursesByMatchingFactor(coursesWithEmptyFields, 'Mathematics');
        expect(result[0].name).toBe('Advanced Mathematics');
    });
});
