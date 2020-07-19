const Post = require('../../database/postModel')

module.exports = {
    Query: {
        async getPost(){
             try {
                 const post = await Post.find()
                 return post
             } catch (error) {
                  console.log(error)               
             }
         }
      }
}