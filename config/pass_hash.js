const bcrypt = require('bcrypt');

async function hashPassword(){
    const mypassword='admin-123';

    const hash = await bcrypt.hash(mypassword,10);
    console.log(hash);
}

hashPassword();