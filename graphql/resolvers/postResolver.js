const Post = require('../../database/postModel')
const { Mutation } = require('./userResolver')
const { checkAuth } = require('../../utils/checkAuth')

module.exports = {
    Query: {
        async getPost(){
             try {
                 const post = await Post.find()
                 return post
             } catch (error) {
                  console.log(error)               
             }
         },

        async getIdPost(_, {postId}){
            try {
                const indexPost = await Post.findById(postId)
                if (indexPost) {
                    return indexPost
                }  else {
                    throw new Error("post not found")
                }
            } catch (error) {
                throw new Error(error)
            }
        }
      },
    
      Mutation: {
          async createPost(_, {body}, context){
            // check if the user is authenticated
            const authUser = checkAuth(context)
            console.log(authUser); 

            //adding a post 
            const post = new Post({
                body, 
                user: authUser.id, 
                username: authUser.username, 
                createdAt: new Date().toISOString()
            })

            const newPost = await post.save();
            return newPost
          }
      }
}