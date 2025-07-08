const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const pool = require('../db/pool')
const bcrypt = require('bcryptjs')

const customFields = {
  usernameField: 'email',
  passwordField: 'password',
}

const verifyCallback = async (username, password, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [username])
    const user = rows[0]

    if (!user) return done(null, false, { message: 'Incorrect email' })

    const match = await bcrypt.compare(password, user.password)

    if (!match) return done(null, false, { message: 'Incorrect password' })

    return done(null, user)
  } catch (error) {
    return done(error)
  }
}

const strategy = new LocalStrategy(customFields, verifyCallback)

passport.use(strategy)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (userId, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id=$1', [userId])
    const user = rows[0]

    done(null, user)
  } catch (error) {
    done(error)
  }
})
