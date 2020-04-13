const { Client } = require('pg');
const config = require('./config.json');

const client = new Client({
    user: config.database.user,
    host: config.database.host,
    port: config.database.port,
    database: config.database.database,
    password: config.database.password
});

client.connect();

module.exports = {
    async getPersons() {
        return (await client.query('SELECT * FROM persons')).rows;
    },

    async init() {
        try {
            await this.getPersons();
        } catch (e) {
            await client.query('CREATE TABLE persons (id bigint, count bigint)');
        }
    }
};