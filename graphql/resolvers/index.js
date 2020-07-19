const PostResolver = require('./postResolver');
const UserResolver = require('./userResolver');

module.exports = {
    Query: {
        ...PostResolver.Query
    },
    Mutation: {
        ...UserResolver.Mutation
    }
}