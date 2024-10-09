import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

import { endpoints } from "@/api";
import { fetchWithServices } from "@/api/fetchWithServices.ts";
import { ResponseError } from "@/utils/Errors/ResponseError.ts";

export const useOAuth = () => {
    const location = useLocation();
    return useQuery({
        queryKey: ['oauth', location.search],
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        queryFn: async () => {
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
                throw new ResponseError(data.message, response, 'oauth-error');
            }
            return data;
        }
    });
};