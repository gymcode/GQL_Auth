const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server");
const User = require("../../database/userModel");
const { SECRET_KEY, ACCOUNTID, AUTHTOKEN, SERVICEID } = require("../../config");
const client = require("twilio")(ACCOUNTID, AUTHTOKEN);

const {
  UserRegistrationValidator,
  UserLoginValidator,
} = require("../../utils/validator");

const tokenGeneration = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};

module.exports = {
  Mutation: {
      // pin verifcation
    async verify(_, {phone, code}){
        const user = await User.findOne({ phone });

        if (!user) {
          errors.general = "User not found";
          throw new UserInputError("User not found", { errors });
        }

        // verify user token
        const sms = client.verify
                        .services(SERVICEID)
                        .verificationChecks
                        .create({
                            to: phone,
                            code: code
                        })
                        .then((verify) => console.log(verify))
                        .catch((err) => console.log(err));
        
         return {
            ...user._doc,
            id: user._id,
            token,
        };

    },
    // user login
    async login(_, { phone, password }) {
      // normal login validation
      const { valid, errors } = UserLoginValidator(phone, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // searching for the user from the database
      const user = await User.findOne({ phone });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        errors.general = "User not found";
        throw new UserInputError("Wrong Credentials", { errors });
      }

      //  generation of token
      const token = tokenGeneration(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    // user registration
    async register(
      _,
      { registerInput: { username, email, phone, password, confirmPassword } }
    ) {
      //normal validation for users
      const { valid, errors } = UserRegistrationValidator(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // checking if email already exists
      const userPhone = await User.findOne({ email });
      if (userPhone) {
        throw new UserInputError("Phone already exist in the database", {
          error: {
            email: "This phone has already been taken",
          },
        });
      }

      // password hashing
      password = await bcrypt.hash(password, 12);

      // inserting user into the database
      const newUser = new User({
        username,
        email,
        phone,
        password,
        createdAt: new Date().toISOString(),
      });

      // storing user
      const res = await newUser.save();

      // generating token
      // creating payload
      const token = tokenGeneration(res);

      // send message for starts to user for input
      const sms = client.verify
        .services(SERVICEID)
        .verifications.create({
          to: phone,
          channel: "sms",
        })
        .then((verify) => console.log(verify))
        .catch((err) => console.log(err));

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
