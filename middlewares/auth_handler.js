const boom = require('@hapi/boom');
const {config} = require('./../config/config')


function checkApiKey(req, res, next){
    const apiKey= req.headers['api'];
    console.log(apiKey);
    console.log(config.apiKey);
    if(apiKey == config.apiKey){
        next();
    }else{
        next(boom.unauthorized());
    }
}

function checkAdminRole(req, res, next){
    const user = req.user;
    if(user.role==1){
        next();
    }
    else{
        next(boom.unauthorized());
    }
}


module.exports= { checkApiKey, checkAdminRole}