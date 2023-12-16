export const mongooseConfig = {
    username: 'root-user',
    password: 'root-password',
    host: 'localhost',
    port: '27017',
    dbName: 'tum-rating',
    get connectionUrl() {
        return (
            'mongodb://' +
            this.username +
            ':' +
            this.password +
            '@' +
            this.host +
            ':' +
            this.port
        );
    },
};
