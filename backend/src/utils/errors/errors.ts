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

export class AddUserReviewError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Add user review error';
  }
}

export class AddUserReviewNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Add user review not found error';
  }
}

export class UserReviewSemesterMismatch extends Error {
  constructor(message) {
    super(message);
    this.name = 'user review semester mismatch';
  }
}