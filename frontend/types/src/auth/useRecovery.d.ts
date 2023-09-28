interface RecoveryBody {
    email: string;
}
export declare function useRecovery(): (recoveryBody: RecoveryBody) => Promise<boolean>;
export {};
