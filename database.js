const { Client } = require('pg');
const config = require('./config.json');

const client = new Client({
    user: config.database.user,
    host: config.database.host,
    port: config.database.port,
    database: config.database.database,
    password: config.database.password
});

module.exports = {
    async init() {

    }
};