export class DuplicateError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Duplicate error';
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
