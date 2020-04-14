const { Client } = require('pg');
const config = require('./config.json');

const client = new Client({
    user: config.database.user,
    host: config.database.host,
    password: config.database.password,
    port: config.database.port,
    database: config.database.database
});

client.connect();

module.exports = {
    async getPerson(id) {
        return (await client.query(`SELECT * FROM persons WHERE id = ${id}`)).rows[0];
    },

    async getPersons() {
        return (await client.query('SELECT * FROM persons')).rows;
    },

    async updateParson(id, count) {
        return (await client.query(`UPDATE persons SET count = ${count} WHERE id = ${id}`));
    },

    async getUser(uid) {
        return (await client.query(`SELECT * FROM users WHERE uid = ${uid}`)).rows[0];
    },

    async getUsers() {
        return (await client.query('SELECT * FROM users')).rows;
    },

    async updateUser(uid, id) {
        return (await client.query(`UPDATE users SET count = ARRAY_APPEND(count, ${id}) WHERE uid = ${uid}`));
    },

    async init() {
        try {
            let persons = await this.getPersons();
            if (persons.length != config.persons) {
                throw new Error;
            }
        } catch (e) {
            try { await client.query('DROP TABLE persons'); } catch (e) { }
            await client.query('CREATE TABLE persons (id int, count int)');

            for (let i = 1; i <= config.persons; ++i) {
                await client.query(`INSERT INTO persons (id, count) VALUES (${i}, 0)`);
            }
        }

        try {
            let users = await this.getUsers();
            if (users.length != config.users) {
                throw new Error;
            }
        } catch (e) {
            try { await client.query('DROP TABLE users'); } catch (e) { }
            await client.query('CREATE TABLE users (uid int, count int[])');

            for (let i = 1; i <= config.users; ++i) {
                await client.query(`INSERT INTO users (uid, count) VALUES (${i}, '{}')`);
            }
        }
    }
};