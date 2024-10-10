import { OIDCCreateMockUser } from '@tum-rating/backend/test/utils/api-client/oidc';

(async () => {
    console.log('OAuth Users:');

    const oidcMockUser = await OIDCCreateMockUser();

    console.log('User: ', oidcMockUser);
})();