const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {UserInputError} = require('apollo-server')
const User = require('../../database/userModel');
const { SECRET_KEY } = require('../../config')

const { UserRegistrationValidator, UserLoginValidator } = require('../../utils/validator');

const tokenGeneration = (user)=>{
    return jwt.sign({
        id: user.id, 
        username: user.username, 
        email: user.email
    }, SECRET_KEY, { expiresIn: '1h'});
}

module.exports = {
   Mutation: {
    // user login
       async login(_, {email, password}){
        // normal login validation 
        const {valid, errors} = UserLoginValidator(email, password)

        if (!valid) {
            throw new UserInputError("Errors", {errors})
        }

        // searching for the user from the database
        const user = await User.findOne({email})

        if (!user) {
            errors.general = "User not found";
            throw new UserInputError('User not found', {errors})
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
         if (!passwordMatch) {
            errors.general = "User not found";
            throw new UserInputError('Wrong Credentials', {errors})
         }

        //  generation of token
        const token = tokenGeneration(user)

        return {
            ...user._doc,
            id: user._id,
            token
        }


       },
    

    // user registration 
       async register(_, { registerInput: {username, email, password, confirmPassword}} ){

        //normal validation for users
        const {valid, errors}  = UserRegistrationValidator(username, email, password, confirmPassword); 

        if (!valid) {
            throw new UserInputError("Errors", {errors})
        }

        // checking if email already exists
        const userEmail = await User.findOne({email})
        if (userEmail) {
            throw new UserInputError("Email already exist in the database", {
                error: {
                    email: "This email has already been taken"
                }
            })
        }

            // password hashing 
        password = await bcrypt.hash(password, 12);

        // inserting user into the database
        const newUser = new User({
            username,
            email, 
            password, 
            createdAt: new Date().toISOString()
        });

        // storing user 
        const res = await newUser.save();     

        // generating token 
        // creating payload
        const token = tokenGeneration(res)

        return {
            ...res._doc,
            id: res._id,
            token
        }

       }
   } 
}