export class DuplicateError extends Error {
    public conflictKey: string | string[];

    constructor(message, conflictKey: string | string[] = []) {
        super(message);
        this.name = 'Duplicate error';
        this.conflictKey = conflictKey;
    }

    public isConflictingKey(key: string): boolean {
        if (Array.isArray(this.conflictKey)) {
            return this.conflictKey.includes(key);
        } else {
            return this.conflictKey === key;
        }
    }
}

export class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'Not found error';
    }
}

export class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'Bad request error';
    }
}

export class CourseReviewSemesterMismatch extends Error {
    constructor(reviewSemester: string, courseSemesters: string[]) {
        super(`Review semester ${reviewSemester} does not match course semesters ${courseSemesters}`);
        this.name = 'user review semester mismatch';
    }
}

export class CourseExamStatsSemesterMismatch extends Error {
    constructor(examStatsSemester: string, courseSemesters: string[]) {
        super(`Exam stats semester ${examStatsSemester} does not match course semesters ${courseSemesters}`);
        this.name = 'course exam stats semester mismatch';
    }
}
