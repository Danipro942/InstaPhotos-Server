const { find } = require('../models/comment')
const Comment = require('../models/comment')

async function addComment(input, ctx) {
    console.log(ctx.user.id)
    try {
        const comment = new Comment({
            idPublication: input.idPublication,
            idUser: ctx.user.id,
            comment: input.comment
        })

        await comment.save()
        return comment
    } catch (error) {
        console.log(error)
    }
}

async function getComment(idPublication){
    const result = await Comment.find({ idPublication}).populate("idUser")
    return result
}

    module.exports = {
        addComment,
        getComment

    }