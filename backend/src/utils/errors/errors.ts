export class DuplicateError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Duplicate error';
  }
}

export class AddReviewError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Add review error';
  }
}
