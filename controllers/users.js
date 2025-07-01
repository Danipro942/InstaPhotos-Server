const User = require('../models/user')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { findById } = require('../models/user');
const axios = require('axios')
const awsUploadImage = require('../utils/aws-upload-image')

function createToken(user, SECRET_KEY, expiresIn) {
    const { id, name, email, username } = user
    const payload = {
        id,
        name,
        email,
        username
    };
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
}
async function register(input) {
    const newUser = input;
    newUser.email = newUser.email.toLowerCase();
    newUser.username = newUser.username.toLowerCase();

    const { username, password, email } = newUser
    // Revisamos si el email esta en uso
    const foundEmail = await User.findOne({ email })
    if (foundEmail) throw new Error('El email ya esta en uso');
    console.log(foundEmail)


    // Revisamos si el username esta en uso
    const foundUsername = await User.findOne({ username });
    if (foundUsername) throw new Error("El nombre de usuario ya esta en uso");
    console.log(foundUsername)

    // Encriptar
    const salt = await bcryptjs.genSaltSync(10);
    newUser.password = await bcryptjs.hash(password, salt)

    try {
        const user = new User(newUser)
        user.save()
        return user
    } catch (error) {
        console.log(error)
    }
}

async function login(input) {
    const { email, password } = input

    const userFound = await User.findOne({ email: email.toLowerCase() })
    if (!userFound) throw new Error('Error en el email o contraseña')
    console.log(userFound.id)
    const passwordFound = await bcryptjs.compare(password, userFound.password);
    if (!passwordFound) throw new Error('Error en el email o contraseña')

    console.log('hola');

    return {
        token: createToken(userFound, process.env.SECRET_KEY, "24h")
    };

}

async function getUser(id, username) {
    let user = null;
    if (id) user = await User.findById(id)
    if (username) user = await User.findOne({ username })
    if (!user) throw new Error('El usuario no existe');

    console.log(user)
    return user
}

async function updateUser(input, ctx) {
    console.log(input, 'jejeje')
    const { id } = ctx.user;
    try {
        if (input.currentPassword && input.newPassword) {
            // Cambiar Contraseña
            const userFound = await User.findById(id)
            const passwordSuccess = await bcryptjs.compare(input.currentPassword, userFound.password);
            if (!passwordSuccess) throw new Error('Contraseña Incorrecta')

            const salt = await bcryptjs.genSaltSync(10);
            const newPasswordCrypt = await bcryptjs.hash(input.newPassword, salt)


            await User.findByIdAndUpdate(id, { password: newPasswordCrypt })
        } else {
           /*  if (input.description.length > 50 || input.siteoWeb.length > 50) {
                throw new Error('Coloca alo mas')
            } else { */

                await User.findByIdAndUpdate(id, input)
            }

        

            // || input.siteoWeb.length > 50

        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

async function updateAvatar(file, ctx) {
    const { id } = ctx.user
    console.log(file)

    const { createReadStream, mimetype } = await file;
    const extension = mimetype.split('/')[1];
    const imageName = `avatar/${id}.${extension}`
    const fileData = createReadStream();

    try {
        const result = await awsUploadImage(fileData, imageName)
        await User.findByIdAndUpdate(id, { avatar: result })
        return {
            status: true,
            urlAvatar: result
        }


    } catch (error) {
        console.log(error)
        return {
            status: false,
            urlAvatar: null
        }
    }
    console.log(imageName)
}

async function deleteAvatar(ctx) {
    const { id } = ctx.user
    console.log(id)
    try {
        await User.findByIdAndUpdate(id, { avatar: '' })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

async function search(search) {
    const users = await User.find({
        username: { $regex: search, $options: 'i' } 
    })
    return users
}



module.exports = {
    register,
    login,
    getUser,
    updateAvatar,
    updateUser,
    deleteAvatar,
    search,
}