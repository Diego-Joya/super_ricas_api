const {response} = require('express');
const { validationResult } = require('express-validator');

const validateRoutes = (req, res= response, next)=>{
const err = validationResult(req);
console.log(err);

if(!err.isEmpty()){
    return res.status(400).json({
        ok: false,
        errors: err.mapped()
    });
}
next();
}

module.exports = {
    validateRoutes
}

