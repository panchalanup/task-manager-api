const express = require('express')
const multer = require('multer')     // This library used for Uploading the files
const sharp = require('sharp')       // This library used for convert large images into common formats
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const { request } = require('express')
const router = new express.Router()

// Creating endpoint for create new user (using async await)
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })      // Hide the data using toJSON method
    } catch (e) {
        res.status(400).send(e)
    }
})

// Creating User logging Endpoint
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// Upload Avatar
// Creating Endpoint for avatar Uploading using multer
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {     // cb is a callback function
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('please upload an image!'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width:250, height:250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// Delete Avatar
// Creating Endpoint for avatar Deleting using multer
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// Get avatar
// Creating Endpoint for getting avatar using multer
router.get('/users/:id/avatar',async (req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            return new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch(error){
        res.status(404).send(error)
    }
})

// Creating User logout Endpoint
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

// Creating user logoutAll (in the sense of logout in all the devices or all the platform)
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

// Read profile
// Creating Endpoint for fetching the user (using async await)
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// Update user
// Creating endpoint for update the user (using async await)
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updtes!' })
    }

    try {
        //const user = await User.findById(req.params.id)

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete user
// Creating endpoint for delete the user (using async await)
router.delete('/users/me', auth, async (req, res) => {
    try {
        req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router