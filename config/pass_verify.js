const bcrypt = require('bcrypt');

async function verifyPassword(){
    const mypassword='admin-123';
    const hash='$2b$10$PLFVSmJtFSwUWF9Fn9dydOnBXCgCaf/fsbN9lhMI0bFLfon6esPWu';

    const verify = await bcrypt.compare(mypassword,hash);
    console.log(verify);
}

verifyPassword();