// config/database.js
const dbuser = 'heroku_7npd58d5';
const dbpassword = '12345678Aa';

module.exports = {
    'MONGODB_URI' : `mongodb://${dbuser}:${dbpassword}@ds223161.mlab.com:23161/heroku_7npd58d5`
};