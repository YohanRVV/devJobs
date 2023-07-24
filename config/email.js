require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');


module.exports = {
    user: process.env.USER_MAIL,
    pass: process.env.PASS_MAIL,
    host: process.env.HOST_MAIL,
    port: process.env.PORT_MAIL,
}