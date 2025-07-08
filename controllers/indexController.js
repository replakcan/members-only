const bcrypt = require('bcryptjs')
const pool = require('../db/pool')
const passport = require('passport')
const { validateUser, validationResult } = require('../config/validator')

exports.renderLoginForm = (req, res) => {
  res.render('login-form')
}

exports.usersLoginRedirect = passport.authenticate('local', {
  successRedirect: '/login-success',
  failureRedirect: '/login-failure',
})

exports.renderRegisterForm = (req, res) => {
  res.render('register-form')
}

exports.usersCreatePost = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).render('register-form', {
        errors: errors.array(),
        data: req.body,
      })
    }

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
  },
]

exports.renderProtectedRoute = (req, res) => {
  res.send('You made it to the protected route')
}

exports.renderMemberRoute = (req, res) => {
  res.send('You made it to the member route ')
}

exports.usersLogoutGet = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
  })
  res.redirect('/protected-route')
}

exports.usersLoginSuccess = (req, res) => {
  res.send('<p>You successfully logged in. --> <a href="/">To view all messages</a></p>')
}

exports.usersLoginFailure = (req, res) => {
  res.send('Wrong user credentials')
}

exports.renderHomePage = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users AS u INNER JOIN messages AS m ON u.id=m.user_id')
    console.log(rows)
    const messages = rows

    res.render('home', { messages })
  } catch (error) {
    next(error)
  }
}

exports.usersGetMembership = (req, res) => {
  const { user } = req

  if (user.membership_status) {
    res.send('you already have an active membership!')
  } else {
    res.render('get-membership')
  }
}

exports.updateUserMembershipStatus = async (req, res) => {
  const { user } = req
  const { membership_passcode } = req.body

  try {
    if (membership_passcode == process.env.MEMBERSHIP_PASSCODE) {
      await pool.query('UPDATE users SET membership_status=true WHERE id=$1', [user.id])

      res.redirect('/')
    } else {
      res.redirect('/get-membership')
    }
  } catch (error) {
    return next(error)
  }
}
