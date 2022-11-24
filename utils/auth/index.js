const passport = require('passport');

const LocalStrategy = require('./strategies/local-strategy');
const JwStrategy = require('./strategies/jwt-strategy');

passport.use(LocalStrategy);
passport.use(JwStrategy);