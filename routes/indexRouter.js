const { Router } = require('express')
const { isAuth, isMember } = require('./authMiddleware')
const indexController = require('../controllers/indexController')

const indexRouter = Router()

indexRouter.get('/login', indexController.renderLoginForm)

indexRouter.post('/login', indexController.usersLoginRedirect)

indexRouter.get('/register', indexController.renderRegisterForm)

indexRouter.post('/register', indexController.usersCreatePost)

indexRouter.get('/protected-route', isAuth, indexController.renderProtectedRoute)

indexRouter.get('/member-route', isMember, indexController.renderMemberRoute)

indexRouter.get('/logout', indexController.usersLogoutGet)

indexRouter.get('/login-success', indexController.usersLoginSuccess)

indexRouter.get('/login-failure', indexController.usersLoginFailure)

indexRouter.get('/get-membership', isAuth, indexController.usersGetMembership)

indexRouter.post('/get-membership', isAuth, indexController.updateUserMembershipStatus)

indexRouter.get('/', indexController.renderHomePage)

module.exports = indexRouter
