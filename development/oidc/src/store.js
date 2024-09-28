export class Store {
    constructor(defaultUsers = []) {
        this.users = {};

        for (const user of defaultUsers) {
            this.addUser(user.email, user.sub);
        }
    }

    addUser(email, sub) {
        this.users[email] = {
            email,
            sub
        };
    }

    getUser(email) {
        return this.users[email];
    }

    getAllUsers() {
        return Object.values(this.users);
    }

    deleteUser(email) {
        delete this.users[email];
    }

    clear() {
        this.users = {};
    }
}

export const inMemoryStore = new Store([
    { email: 'oidc@mytum.de', sub: '00000000-0000-0000-0000-000000000000' },
]);
