const { response } = require('express');

const validateUsers = async(req, res= response) =>{
    
    try {
        console.log("prueba");
        return true;
        
    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    validateUsers
}