const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const { AuthenticationError } =  require('apollo-server')


module.exports.checkAuth = (context)=>{
    // checking for authorization from the header
    const AuthHeader = context.req.headers.authorization;
    console.log(AuthHeader)
    if (AuthHeader) {
        // getting the bearer ....
        const token = AuthHeader.split('Bearer ')[1];
        console.log(token)
        if (token) {
            // verifying the token provided by the user
            try {
                const userToken = jwt.verify(token, SECRET_KEY)
                return userToken
            } catch (error) {
                throw new AuthenticationError("Invalid or expired token")
            }
        }
        throw new Error("Authorization token must be bearer [Token]")
    }
    throw new Error("Authentication header must be provided")
}