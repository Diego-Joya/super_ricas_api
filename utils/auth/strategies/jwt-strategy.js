const { Strategy, ExtractJwt } = require("passport-jwt");
const { config } = require('./../../../config/config');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:config.jwtsecret
}

const JwStrategy = new  Strategy(options, (payload, done)=>{
    return done(null, payload);
});

module.exports = JwStrategy;

