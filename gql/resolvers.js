const userContollers = require('../controllers/users')
const followControllers = require('../controllers/follow')
const publicationControllers = require('../controllers/publication')
const commentControllers = require('../controllers/comment')
const likeControllers = require('../controllers/like')

const resolvers = {
    Query: {
        // Usuario
        getUser: (_, { id, username }) => userContollers.getUser(id, username),
        search: (_, {search}) => userContollers.search(search),

        // Follow
        isFollow: (_, {username}, ctx) => followControllers.isFollow(username, ctx),
        getFollowers: (_, {username}) => followControllers.getFollowers(username),
        getFolloweds: (_, {username}) => followControllers.getFolloweds(username),
        getNotFolloweds: (_, {}, ctx) => followControllers.getNotFolloweds(ctx), 

        // Publication
        getPublications: (_, {username}) => publicationControllers.getPublications(username),
        getPublicationsFolloweds: (_, {}, ctx) => publicationControllers.getPublicationsFolloweds(ctx),
        // Comment
        getComments: (_, {idPublication}) => commentControllers.getComment(idPublication),
        // Like
        isLike: (_, {idPublication}, ctx) => likeControllers.isLike(idPublication, ctx),
        countLikes: (_, {idPublication}) => likeControllers.countLikes(idPublication),
    },
    Mutation: {
        // User
        register: (_, { input }) => userContollers.register(input),
        login: (_, { input }) => userContollers.login(input),
        updateAvatar: (_, { file }, ctx) => userContollers.updateAvatar(file, ctx),
        updateUser: (_, { input }, ctx) => userContollers.updateUser(input, ctx),
        deleteAvatar: (_, {}, ctx) => userContollers.deleteAvatar(ctx),
        // Follow
        follow: (_, { username }, ctx) => followControllers.follow(username, ctx),
        unFollow: (_, { username }, ctx) => followControllers.unFollow(username, ctx),
        // Publish
        publish: (_, {file}, ctx) => publicationControllers.publish(file, ctx),

        // Comment

        addComment: (_, {input}, ctx) => commentControllers.addComment(input, ctx),
        // Like
        addLike: (_, {idPublication}, ctx) =>  likeControllers.addLike(idPublication, ctx),
        deleteLike: (_, {idPublication}, ctx) => likeControllers.deleteLike(idPublication, ctx),
    },
}

module.exports = resolvers