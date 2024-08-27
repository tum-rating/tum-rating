export async function baseFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    return fetch(input, init);
}
