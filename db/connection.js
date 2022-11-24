// const express = require('express');
const { Pool } = require('pg');
const { config } = require('./../config/config');

const USER= encodeURIComponent(config.dbuser); 
const PASSWORD= encodeURIComponent(config.dbPassword); 
const URL= `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const pool = new Pool({connectionString:URL})
    
<<<<<<< HEAD
 
=======
>>>>>>> fe2a892f2ba5e753d095c0c5355b445de1db6865

module.exports= pool;