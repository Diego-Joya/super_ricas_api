const express = require('express');
const { Pool } = require('pg');
const { config } = require('./../config/config');

const USER= encodeURIComponent(config.dbuser); 
const PASSWORD= encodeURIComponent(config.dbPassword); 
const URL= `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const pool = new Pool({connectionString:URL})
    
    // const pool = new Pool({
    //     user: 'yekog',
    //     host: 'supericas.cuqmwcyirxzy.us-east-1.rds.amazonaws.com',
    //     password: 'yekog123',
    //     database: 'super_ricas',
    //     port: '5432'
    // });


module.exports= pool;