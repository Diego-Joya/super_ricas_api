const express = require('express');
require('dotenv').config();
const routerApi = require('./routes')
const {logErrors, errorHandler, boomErrorHandler} = require('./middlewares/error_handler');

const cors = require('cors');
const{checkApiKey}= require('./middlewares/auth_handler');

const app = express();
app.use(cors());
require('./utils/auth');

// app.get('/nueva-ruta', checkApiKey,(req, res)=>{
app.get('/nueva-ruta', checkApiKey,(req, res)=>{
    res.send('holaaa nene');
});

app.use(express.static('public'));

app.use(express.json());

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

console.log(process.env.PORT);

app.listen(process.env.PORT, () =>{
    console.log(`Sevidor corriendo ${process.env.PORT}`);
});