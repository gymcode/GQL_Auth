const { gql } = require('apollo-server');

module.exports = gql`
    type Post{
        id: ID!, 
        body: String!, 
        createdAt: String!, 
        username: String!
    }
    type User{
        id: ID!, 
        username: String!, 
        email: String!,
        token: String!, 
        createdAt: String!,
    }
    input RegisterInput{
        username: String!, 
        email: String!,
        password: String!, 
        confirmPassword: String!,                
    }
    type Query{
        getPost: [Post], 
        getIdPost(postId: ID!): Post
    }
    type Mutation{
        register(registerInput: RegisterInput): User!,
        login(email: String!, password: String!): User!
        createPost(body: String!): Post!, 
        deletePost(PostId: ID!): String!
    }
`;

