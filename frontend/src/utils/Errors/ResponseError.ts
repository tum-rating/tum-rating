export class ResponseError extends Error {
    public response: Response;
    public status: number;
    public errorId: string;

    constructor(message: string, response: Response, errorId: string) {
        super(message);
        this.response = response;
        this.status = response.status;
        this.errorId = errorId;
    }
}