const { Router } = require('express')
const passport = require('passport')
const pool = require('../db/pool')
const bcrypt = require('bcryptjs')
const { isAuth, isMember } = require('./authMiddleware')

const indexRouter = Router()

indexRouter.get('/login', (req, res) => {
  res.render('login-form')
})

indexRouter.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/login-success',
    failureRedirect: '/login-failure',
  })
)

indexRouter.get('/register', (req, res) => {
  res.render('register-form')
})

indexRouter.post('/register', async (req, res) => {
  const { first_name, last_name, email, password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await pool.query('INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)', [
      first_name,
      last_name,
      email,
      hashedPassword,
    ])

    res.redirect('/login')
  } catch (error) {
    console.log(error)
    return next(error)
  }
})

indexRouter.get('/protected-route', isAuth, (req, res) => {
  res.send('You made it to the route.')
})

indexRouter.get('/member-route', isMember, (req, res) => {
  res.send('You made it to the route.')
})

indexRouter.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
  })
  res.redirect('/protected-route')
})

indexRouter.get('/login-success', (req, res) => {
  res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>')
})

indexRouter.get('/login-failure', (req, res) => {
  res.send('You entered the wrong password.')
})

indexRouter.get('/', (req, res) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>')
})

module.exports = indexRouter
