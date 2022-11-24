const jwt = require('jsonwebtoken');

const secret = 'prueba';
const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY2NzUyNjc0M30.kEO-Aleyb-zdwjyf9sQjlgfKkKaVh1elXofHkzfVeI8';


function verifyToken(token,secret){
    return jwt.verify(token, secret);
}

const payload = verifyToken(token, secret);
console.log(payload);