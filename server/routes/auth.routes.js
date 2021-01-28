const { Router } = require('express')
const router = Router()
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')

const User = require('../models/User')

router.post(
  '/registration',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Некорректные данные', errors })
      }

      const { email, password } = req.body

      const candidate = await User.findOne({ email })

      if (candidate) {
        return res
          .status(400)
          .json({ message: 'Такой пользователь уже существует' })
      }

      const hashedPassword = await bcrypt.hash(password, 9)

      const user = new User({ email, password: hashedPassword })
      await user.save()

      res.json({ message: 'Пользователь успешно зарегистрирован' })
    } catch (e) {
      res
        .status(500)
        .json({ message: 'Что-то пошло не так, попробуй еще раз.' })
    }
  }
)

router.post(
  '/login',
  [
    check('email', 'Некорректный email').normalizeEmail().isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Некорректные данные', errors })
      }

      const { email, password } = req.body

      const user = await User.findOne({ email })

      if (!user) {
        return res
          .status(401)
          .json({ message: 'Такой пользователь не зарегистрирован' })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res
          .status(401)
          .json({ message: 'Пароль или почта введены неправильно' })
      }

      const token = jwt.sign({ id: user.id }, config.get('jwtSecret'), {
        expiresIn: '1h',
      })

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          diskSpace: user.diskSpace,
          usedSpace: user.usedSpace,
          avatar: user.avatar,
        },
      })
    } catch (e) {
      res
        .status(500)
        .json({ message: 'Что-то пошло не так, попробуй еще раз.' })
    }
  }
)

module.exports = router
