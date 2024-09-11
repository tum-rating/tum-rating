import {test as setup} from '@playwright/test';

import {fullAuthProcess} from 'tests/e2e/utils/auth.ts';

const authFilesBasePath = 'tests/e2e/utils/.auth/';
const authFileToCreate = ['userToRemove', 'user'];

setup('authenticate', async ({page}) => {
    console.log("NODE_ENV: " + process.env.NODE_ENV)
    for (const authFile of authFileToCreate) {
        await fullAuthProcess(page, authFilesBasePath + authFile + '.json');
    }
});
