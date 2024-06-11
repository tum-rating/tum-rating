import { faker } from '@faker-js/faker';
import { expect, Page } from '@playwright/test';


interface TestUserCredentials{
    email: string;
    username: string;
    password: string;

}

interface AuthAction {
    page: Page;
    user: TestUserCredentials;
}

const generateTestUser = () => {
    return {
        email: faker.internet.email({ provider: 'tum.de' }),
        username: faker.internet.userName(),
        password: faker.internet.password(),
    }
};

const signUp = async (props: AuthAction) => {
    const { page, user } = props;
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByTestId('email').fill(user.email);
    await page.getByTestId('username').fill(user.username);
    await page.getByTestId('password').fill(user.password);
    await page.getByTestId('submit').click();
    await expect(page.getByText(user.email, { exact: true })).toBeVisible();
};

const activateAccount = async (props: AuthAction) => {
    const { page, user } = props;
    const token = await getActivationTokenFromMail(user.email);
    if (token === null) {
        throw new Error('Token not found');
    }
    await page.goto(`/auth/activate?token=${token}`);
    await expect(page.getByText(`Your Account is Activated!`, { exact: true })).toBeVisible();
};

const signIn = async (props: AuthAction) => {
    const { page, user } = props;
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByTestId('email').fill(user.email);
    await page.getByTestId('password').fill(user.password);
    await page.getByTestId('submit').click();
    await page.getByTestId('menu').click();
    await expect(page.getByTestId('username-loaded')).toHaveText(user.username);
    await expect(page.getByTestId('email-loaded')).toHaveText(user.email);
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


export { signUp, activateAccount, signIn, generateTestUser}
