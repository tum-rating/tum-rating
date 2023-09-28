export interface User {
    token: string;
    user: {
        username: string;
        email: string;
        id: number;
    };
}
interface IUseUser {
    user: User | null;
}
export declare function useUser(): IUseUser;
export {};
