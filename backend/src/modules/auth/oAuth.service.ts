import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Issuer, generators } from 'openid-client';

interface ValidateAuthorizationCodeResponse {
    sub?: string;
    email: string;
}

@Injectable()
export class OAuthService implements OnModuleInit {
    private _isOAuthEnabled: boolean;
    private _issuerURL: string;
    private _clientId: string;
    private _clientSecret: string;
    private _redirectURL: string;
    private _client: Client;
    private _codeVerifier: string;


    constructor(
        private readonly _configService: ConfigService,
    ) {
        this._isOAuthEnabled = this._configService.getOrThrow<boolean>('oauth.isEnabled');

        if (this._isOAuthEnabled) {
            this._issuerURL = this._configService.getOrThrow<string>('oauth.issuerURL');
            this._clientId = this._configService.getOrThrow<string>('oauth.clientId');
            this._clientSecret = this._configService.getOrThrow<string>('oauth.clientSecret');
            this._redirectURL = this._configService.getOrThrow<string>('oauth.redirectURL');
        }
    }
    
    async onModuleInit() {
        if (!this._isOAuthEnabled) {
            return;
        }

        await this._initializeClient();
    }

    private async _checkIfIsEnabled() {
        if (!this._isOAuthEnabled) {
            throw new Error('OAuth is not enabled');
        }
    }

    private async _initializeClient() {
        const issuer = await Issuer.discover(this._issuerURL);
        this._client = new issuer.Client({
            client_id: this._clientId,
            client_secret: this._clientSecret,
            redirect_uris: [this._redirectURL],
            response_types: ['code'],
        });
        this._codeVerifier = generators.codeVerifier();
    }

    public async getAuthorizationURL(): Promise<string> {
        await this._checkIfIsEnabled();

        return this._client.authorizationUrl({
            scope: 'openid email profile',
            code_challenge: generators.codeChallenge(this._codeVerifier),
            code_challenge_method: 'S256',
        });
    }

    public async validateAuthorizationCode(redirectURL: string): Promise<ValidateAuthorizationCodeResponse> {
        await this._checkIfIsEnabled();

        const params = this._client.callbackParams(redirectURL);

        const tokenSet = await this._client.callback(this._redirectURL, params, { code_verifier: this._codeVerifier });
        console.log('retrieved token: ', tokenSet);

        if (!tokenSet.access_token) {
            throw new Error('No access token in auth response');
        }

        const userData = await this._client.userinfo(tokenSet);

        if (!userData) {
            throw new Error('No user data in auth response');
        }

        if (!userData.email) {
            throw new Error('No email in user data');
        }

        console.log('user data: ', userData);

        return {
            sub: userData.sub,
            email: userData.email,
        };
    }
}
