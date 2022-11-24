// const boom = require("@hapi/boom");

function logErrors(err,req, res, next){
    console.log('mostrando errores');

    console.error(err);
    next(err);
}

function errorHandler(err, req, res, next){
    res.status(500).json({
        messege: err.messege,
        stack: err.stack
    });
}


function boomErrorHandler(err, req, res, next){
    console.log(err);
    if(err.isBoom){
        const {output} = err;
        res.status(output.statusCode).json(output.payload);
    }
    next(err);
}

module.exports ={ logErrors, errorHandler, boomErrorHandler}