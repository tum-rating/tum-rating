export class ClientParseCourseError extends Error {
    constructor(message: string) {
        super(`Parsing course failed: ${message}`);
        this.name = 'client parse course error';
    }
}

