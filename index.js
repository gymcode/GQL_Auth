const {ApolloServer, gql} = require('apollo-server');
const mongoose = require('mongoose');
const { MONGODB } = require('./config');

//database tables

const User = require('./database/userModel')

const resolvers = require('./graphql/resolvers/index');
const typeDefs = require('./graphql/typeDefs')

const server = new ApolloServer({
    typeDefs, 
    resolvers, 
    context: (({req})=>({req}))
});

mongoose.connect(MONGODB, {useNewUrlParser: true, useUnifiedTopology: true}, (err)=>{
    if (err) throw err
    console.log("Database connection established succeefully");
});

server.listen({port: 3000}).then((res)=>{
    console.log(`Server running on ${res.url}`);
}).catch(err=>{
    console.log(err)
})