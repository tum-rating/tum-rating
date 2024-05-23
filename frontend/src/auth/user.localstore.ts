export const USER_LOCAL_STORAGE_KEY = 'TUM-REVIEW-USER';

export function saveUser(user: string): void {
    localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user));
}

export function getUser(): string | undefined {
    return localStorage.getItem(USER_LOCAL_STORAGE_KEY);
}

export function removeUser(): void {
    localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
}
