import {useQuery} from "@tanstack/react-query";
import {useLocation} from 'react-router-dom';
import {UserStatusGuard} from "@/components/UserStatusGuard";
import {endpoints} from "@/api";
import {fetchWithServices} from "@/api/fetchWithServices.ts";
import {ResponseError} from "@/utils/Errors/ResponseError.ts";
import {UserStatusGuardPanelInterface} from "@/components/UserStatusGuard/UserStatusGuard.tsx";

const useOAuth = () => {
    const location = useLocation();
    return useQuery({
        queryKey: ['oauth', location.search],
        queryFn: async () => {
            const queryParams = new URLSearchParams(location.search);
            const response = await fetchWithServices(endpoints.sso, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    redirectURL: `${location.pathname}${location.search}`,
                }),
            });
            const data = await response.json();
            if (!response.ok) {

                if (!response.ok) throw new ResponseError(data.message, response, 'oauth-error');
            }
            return data;
        }
    });
}

const OAuthStatus: Record<string, UserStatusGuardPanelInterface["status"]> = {
    loading: 'loading',
    success: 'success',
    pending: 'loading',
    fetching: 'loading',
    error: 'error',
    idle: 'loading'
}

export const OAuthRedirect = () => {
    const {data,status, isError,error} = useOAuth();
    const ssoStatus: UserStatusGuardPanelInterface["status"] = OAuthStatus[status];
    console.log(data,error);
    console.log(error?.message)
    return (
        <UserStatusGuard mode={'sso-login'} statusPanels={[
            {
                type: 'request',
                status: ssoStatus,
                title: 'Single Sign-On Login',
                content: ssoStatus === 'loading' ? 'We are verifying your identity...' : isError ? 'An error occurred while verifying your identity' : 'Your identity has been verified',
                apiContextMessage: error?.message
            }
        ]}/>
    );
};