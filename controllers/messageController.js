const pool = require('../db/pool')

exports.renderMessageForm = (req, res) => {
  res.render('message-form')
}

exports.createMessagePost = async (req, res, next) => {
  const { user } = req
  const { title, text } = req.body

  try {
    await pool.query('INSERT INTO messages (title, text, user_id) VALUES($1, $2, $3)', [title, text, user.id])

    res.redirect('/')
  } catch (error) {
    next(error)
  }
}
