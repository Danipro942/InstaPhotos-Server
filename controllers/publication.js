const Publication = require('../models/publication')
const Follow = require('../models/follow')
const User = require('../models/user')
const { v4: uuidv4 } = require('uuid')
const awsUploadImage = require('../utils/aws-upload-image')

async function publish(file, ctx) {
    const { id } = ctx.user
    const { createReadStream, mimetype } = await file;
    const extension = mimetype.split("/")[1]
    const fileName = `publication/${uuidv4()}.${extension}`
    const fileData = createReadStream();

    try {
        const result = await awsUploadImage(fileData, fileName)
        const publication = new Publication({
            idUser: id,
            file: result,
            typeFile: mimetype.split("/")[0],
            createAt: Date.now(),
        });
        publication.save()
        return {
            status: true,
            urlFile: result
        }
    } catch (error) {
        return {
            status: null,
            urlFile: ''
        }
    }

    console.log(mimetype)

    return null
}

async function getPublications(username) {
    const user = await User.findOne({ username })
    if (!user) throw new Error('El usuario no existe')



    const publications = await Publication.find().where({ idUser: user._id }).sort({ createAt: -1 })


    return publications;
}

async function getPublicationsFolloweds(ctx) {
    try{
        const followeds = await Follow.find({ idUser: ctx.user.id }).populate("follow")

        const followedsList = [];
        for await (const data of followeds){
            followedsList.push(data.follow)
        }
    
        const publicationList = []
        for await (const data of followedsList) {
            const publications = await Publication.find().where({idUser: data._id}).sort({createAt: -1}).populate("idUser").limit(100)
            publicationList.push(...publications)
    
        }
        const result = publicationList.sort((a,b ) => {
            return new Date(b.createAt) - new Date(a.createAt);
        });
        console.log(result, 'jejeej')
    return result

    } catch(error){
        console.log(error)
    }
    
    
}

module.exports = {
    publish,
    getPublications,
    getPublicationsFolloweds
}