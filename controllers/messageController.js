const db = require('../db/queries')

exports.renderMessageForm = (req, res) => {
  res.render('message-form')
}

exports.createMessagePost = async (req, res, next) => {
  const { user } = req
  const { title, text } = req.body

  try {
    await db.createNewMessageByUserId(title, text, user.id)

    res.redirect('/')
  } catch (error) {
    next(error)
  }
}
