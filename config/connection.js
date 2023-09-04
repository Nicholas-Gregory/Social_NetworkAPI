const { connect, connection } = require('mongoose');
require('dotenv').config();

connect(process.env.DB_CONNECTION_STRING);

module.exports = connection;