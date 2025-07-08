const { body, validationResult } = require('express-validator')
const pool = require('../db/pool')

const alphaErr = 'must contain only letters'
const lengthErr = 'must be between 1 and 10 characters'

const validateUser = [
  body('first_name')
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),

  body('last_name')
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (value) => {
      const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [value])

      const user = rows[0]

      if (user) throw new Error('E-mail already in use')
    }),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('passwordConfirmation')
    .custom((value, { req }) => {
      return value === req.body.password
    })
    .withMessage('passwords do not match'),
]

module.exports = { validateUser, validationResult }
