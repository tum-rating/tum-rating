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
    user?: TestUserCredentials;
    mobile?: boolean;
}

const generateTestUser = () => {
    return {
        email: faker.internet.email({provider: 'tum.de'}),
        username: faker.internet.userName(),
        password: faker.internet.password(),
    };
};

const fullAuthProcess = async (page: Page, authFile: string) => {
    const user = generateTestUser();
    await page.goto('/');
    await page.getByTestId('sign-up-btn-desktop').click();
    await page.getByText('Sign up', {exact: true}).click();
    await signUp({page, user});
    await activateAccount({page, user});
    await page.goto('/');
    await page.getByTestId('sign-in-btn-desktop').click();
    await signIn({page, user});
    await page.context().storageState({path: authFile});
    await page.goto('/');
    await signOut({page, mobile: false});
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

const signUp = async (props: AuthAction) => {
    const {page, user} = props;

    const form = page.getByTestId('sign-up-form');

    await form.locator('[data-testid="username"]').fill(user.username);

    await form.locator('[data-testid="email"]').fill(user.email);

    await form.locator('[data-testid="password"]').fill(user.password);

    await form.locator('[data-testid="submit"]').click();

    await page.waitForSelector('text=Check Your Email');
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
    const {page, user, mobile} = props;

    const form = page.getByTestId('sign-in-form');

    await form.locator('[data-testid="email"]').fill(user.email);

    await form.locator('[data-testid="password"]').fill(user.password);

    await form.locator('[data-testid="submit"]').click();

    await page.waitForTimeout(1000);

    if (mobile) {
        await page.locator('[data-testid="user-btn-mobile"]').isVisible();
        await page
            .locator('[data-testid="user-btn-username-mobile"]')
            .textContent()
            .then((text) => {
                return expect(text).toBe(user.username);
            });
    } else {
        await page
            .locator('[data-testid="user-btn-desktop"]')
            .click()
            .then(async () => {
                await page
                    .locator('[data-testid="user-btn-username-desktop"]')
                    .textContent()
                    .then((text) => {
                        return expect(text).toBe(user.username);
                    });
            });
    }
};

const signOut = async (props: AuthAction) => {
    const {page, mobile} = props;
    if (mobile) {
        await openMobileDrawer({page});
        await page.getByRole('button', {name: 'Log out'}).click();
    } else {
        await page.getByTestId('user-btn-desktop').click();
        await page.getByRole('menuitem', {name: 'Logout'}).click();
        await expect(page.getByTestId('menu')).not.toBeVisible();
    }
    await expect(page.getByRole('button', {name: 'Sign In'})).toBeVisible();
    await expect(page.getByRole('button', {name: 'Sign Up'})).toBeVisible();
};

export {signUp, signOut, activateAccount, signIn, generateTestUser, getRecoveryTokenFromMail, fullAuthProcess};
