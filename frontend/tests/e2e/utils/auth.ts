import {faker} from '@faker-js/faker';
import {expect, Page} from '@playwright/test';

import {openMobileDrawer} from 'tests/e2e/utils/layout.ts';

interface TestUserCredentials {
    email: string;
    username?: string;
    password: string;
}

interface AuthAction {
    page: Page;
    user: TestUserCredentials;
    mobile?: boolean;
}

const generateTestUser = () => {
    return {
        email: faker.internet.email({provider: 'tum.de'}),
        username: faker.internet.userName(),
        password: faker.internet.password(),
    };
};

const signUp = async (props: AuthAction) => {
    const {page, user} = props;
    await page.getByRole('button', {name: 'Sign up'}).click();
    await page.getByTestId('email').fill(user.email);
    await page.getByTestId('username').fill(user.username);
    await page.getByTestId('password').fill(user.password);
    await page.getByTestId('submit').click();
    await expect(page.getByText(user.email, {exact: true})).toBeVisible({timeout: 60000});
};

const activateAccount = async (props: AuthAction) => {
    const {page, user} = props;
    const token = await getActivationTokenFromMail(user.email);
    if (token === null) {
        throw new Error('Token not found');
    }
    await page.goto(`/auth/activate?token=${token}`);
    await expect(page.getByText(`Your Account is Activated!`, {exact: true})).toBeVisible();
};

const signIn = async (props: AuthAction) => {
    const {page, user, mobile = false} = props;
    if (mobile) {
        await page.getByTestId('drawer-content').getByTestId('sign-in-btn').click();
    } else {
        await page.getByRole('button', {name: 'Sign In'}).first().click()
    }
    await page.getByTestId('email').fill(user.email);
    await page.getByTestId('password').fill(user.password);
    await page.getByTestId('submit').click();
    if (mobile) {
        await openMobileDrawer({page});
        await expect(page.getByTestId('email-loaded')).toHaveText(user.email);
    } else {
        await page.getByTestId('menu').click();
        await expect(page.getByTestId('email-loaded-dropdown')).toHaveText(user.email);
    }

};

const getActivationTokenFromMail = async (email: string) => {
    const response = await fetch(`http://localhost:1080/email`);
    const data = await response.json();
    let activationToken = null;
    let userMail = data.filter((x) => x.to[0].address === email && x.subject === 'Activate your account');
    const pattern = /token=([\w-]+\.[\w-]+\.[\w-]+)/;
    const match = userMail[0].html.match(pattern);
    if (match) {
        activationToken = match[1];
    }
    return activationToken;
};

const getRecoveryTokenFromMail = async (email: string) => {
    const response = await fetch(`http://localhost:1080/email`);
    const data = await response.json();
    let recoveryToken = null;
    let userMail = data.filter((x) => x.to[0].address === email && x.subject === 'Password recovery');
    const pattern = /token=([\w-]+\.[\w-]+\.[\w-]+)/;
    const match = userMail[0].html.match(pattern);
    if (match) {
        recoveryToken = match[1];
    }
    return recoveryToken;
};

export {signUp, activateAccount, signIn, generateTestUser, getRecoveryTokenFromMail};
