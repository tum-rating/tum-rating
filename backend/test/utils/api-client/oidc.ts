import { faker } from '@faker-js/faker';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import * as qs from 'qs';
import { CookieJar } from 'tough-cookie';

import { OAuthCallbackRequestDto } from '@tum-rating/backend/src/modules/auth/dto/OAuthCallbackRequest.dto';
import { SignInResponseDto } from '@tum-rating/backend/src/modules/auth/dto/SignInResponse.dto';

import { baseUrlV1 } from './config';

export const oauthUrl = baseUrlV1 + '/auth/oauth';

export const getOAuthRedirectURL = async (): Promise<string | null> => {
    const response = await axios.get(oauthUrl, {
        maxRedirects: 0, // Disable redirect following
        validateStatus: function (status) {
          return status >= 300 && status < 400; // Only accept redirect responses
        }
      });
  
      const redirectUrl = response.headers.location;
      return redirectUrl;
}

export const OAuthCallback = async (redirectURL: string) => {
    const requestBody: OAuthCallbackRequestDto = {
        redirectURL: redirectURL
    };

    const response = await axios.post<SignInResponseDto>(oauthUrl, requestBody);
    return response.data;
}

export const performOAuthFlow = async (redirectURL: string, email: string): Promise<string | null> => {
    // Set up the axios client with cookie support
    const jar = new CookieJar();
    const client: AxiosInstance = wrapper(axios.create({
        jar,
        withCredentials: true
    }));

    // Step 1: Perform GET request to the OAuth page
    const resp = await client.get(redirectURL);

    // Step 2: Perform POST request with login credentials
    const loginData = qs.stringify({
        prompt: 'login',
        login: email,
        password: 'your_password' // This can be any value
    });

    const url2 = resp.request.res.responseUrl; // Get the redirect URL from the response
    const loginRequestConfig: AxiosRequestConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8'
        }
    };

    const loginResp = await client.post(url2, loginData, loginRequestConfig);

    // Step 3: Perform POST request to provide consent
    const consentData = qs.stringify({
        prompt: 'consent'
    });

    const url3 = loginResp.request.res.responseUrl;
    const consentRequestConfig: AxiosRequestConfig = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8'
        },
        maxRedirects: 0 // We want to handle redirects manually
    };

    let redirectCount = 0;
    const redirectHandler = (error: any) => {
        if (error.response && error.response.status >= 300 && error.response.status < 400) {
            redirectCount++;
            if (redirectCount === 1) {
                // Follow the first redirect (internal redirect)
                const redirectUrl = error.response.headers.location;
                return client.post(redirectUrl, consentData, consentRequestConfig);
            }
            // Stop at the second redirect (to the provided redirect URL)
            return error.response;
        }
        throw error;
    };

    // Perform the consent request and handle redirects
    const consentResp = await client.post(url3, consentData, consentRequestConfig).catch(redirectHandler);

    // Handle the 2nd redirect, extracting code and state from the URL
    const finalRedirectUrl = consentResp.headers.location;
    if (!finalRedirectUrl) {
        throw new Error('No redirect URL found in the response');
    }


    return finalRedirectUrl;
};

class OIDCMockUser {
    constructor(public sub: string, public email: string) {}
}

export const OIDCCreateUser = async (email: string) => {
    const url = 'http://localhost:1410/users';
    const requestBody = {
      email: email,
    };

    const response = await axios.post(url, requestBody);
    return new OIDCMockUser(response.data.sub, response.data.email);
}


export const OIDCCreateMockUser = async () => {
    const email = faker.internet.email();

    const oidcUser = await OIDCCreateUser(email);

    return oidcUser;
}