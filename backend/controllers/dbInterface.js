let db;

if (process.env.USE_SAMPLE_DB === 'true') {
    console.log('Using sample database');
    db = require('../../database/sample_db');
} else {
    console.log('Using real database');
    db = require('../../database/db');
}

module.exports = db;
