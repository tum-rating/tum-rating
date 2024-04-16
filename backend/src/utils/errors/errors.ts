export class DuplicateError extends Error {
    constructor(message) {
        super(message);
        this.name = 'Duplicate error';
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
