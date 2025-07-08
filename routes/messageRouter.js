const { Router } = require('express')
const messageController = require('../controllers/messageController')
const { isAuth } = require('./authMiddleware')

const messageRouter = Router()

messageRouter.get('/', isAuth, messageController.renderMessageForm)

messageRouter.post('/', messageController.createMessagePost)

module.exports = messageRouter
