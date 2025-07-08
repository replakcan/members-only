require('dotenv').config()
const express = require('express')
const path = require('node:path')
const session = require('express-session')
const pool = require('./db/pool')
const indexRouter = require('./routes/indexRouter')
const messageRouter = require('./routes/messageRouter')
const passport = require('passport')
const pgSession = require('connect-pg-simple')(session)

const app = express()

const sessionStore = new pgSession({ pool })

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

require('./config/passport')

app.use(passport.session())

app.use((req, res, next) => {
  const { session, user } = req

  console.log(session)
  console.log(user)

  res.locals.currentUser = user
  next()
})

app.use('/', indexRouter)
app.use('/messages', messageRouter)

app.use((err, req, res, next) => {
  console.log(err)

  res.status(err.statusCode || 500).send(err.message)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`express is running on port ${PORT}`)
})
