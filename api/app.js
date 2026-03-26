
var express = require('express');
var app = express();

// PostgreSQL setup
const { Pool } = require('pg');

// Create ONE pool (not per request)
const pool = new Pool({
    user: process.env.DBUSER,
    database: process.env.DB,
    password: process.env.DBPASS,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    ssl: {
        rejectUnauthorized: false   // Required for AWS RDS
    }
});

// Routes
app.get('/api/status', function(req, res) {
    pool.query('SELECT now() as time', (err, result) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(result.rows);
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

module.exports = app;
