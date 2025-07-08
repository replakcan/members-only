const pool = require('./pool')

exports.insertUser = async (first_name, last_name, email, hashedPassword) => {
  await pool.query('INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)', [
    first_name,
    last_name,
    email,
    hashedPassword,
  ])
}
exports.findAllMessagesWithUserInfos = async () => {
  const { rows } = await pool.query('SELECT * FROM users AS u INNER JOIN messages AS m ON u.id=m.user_id')

  return rows
}

exports.makeUserMember = async (id) => {
  await pool.query('UPDATE users SET membership_status=true WHERE id=$1', [id])
}

exports.createNewMessageByUserId = async (title, text, id) => {
  await pool.query('INSERT INTO messages (title, text, user_id) VALUES($1, $2, $3)', [title, text, id])
}
