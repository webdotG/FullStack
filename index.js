import express from 'express'
import JWT from 'jsonwebtoken'
import BCRYPT from 'bcrypt'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'
import { registerValidation } from './validations/auth.js'    //обязательно указывать расширение .js
import UserModel from "./models/User.js"
import checkAuth from './utils/checkAuth.js'

mongoose
  .connect('mongodb+srv://webdotg:zxcasdqwe321zxc@first.v5ufhia.mongodb.net/blogbox?retryWrites=true&w=majority')
  .then(() => console.log('DB CONNECT OK!'))
  .catch((err) => console.log('DB CONNECT ERROR! : ', err))

const app = express()
app.use(express.json())                      //для того что бы express приложение понимал json


app.post('/auth/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array())
    }

    const passwordNoHash = req.body.password
    const SALT = await BCRYPT.genSalt(10)
    const HASH = await BCRYPT.hash(passwordNoHash, SALT)

    const document = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: HASH,
      avatarUrl: req.body.avatarUrl
    })

    const user = await document.save()

    const TOKEN = JWT.sign(                     //создание Токена (шифрую id)
      {
        _id: user._id                           //_id по томоу что в Mongo такой синтаксис
      },
      'secret25',                                 // ключ шифрования
      {
        expiresIn: '30d'                        //время жизни Токена
      }
    )

    const { passwordHash, ...userData } = user._doc
    //вытаскиваю пароль и все данные что бы вернуть всё кроме пароля
    res.json({
      message: "юзер сохранён",
      ...userData,
      TOKEN
    })
  } catch (err) {
    console.log('ERROR! CANT SAVE USER : ', err),
      res.status(500).json({
        message: "Не удалось зарегистрироваться !",
      })
  }
})

app.post('/auth/login', async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(404).json({
        message: "пользователь не найден"
      })
    }

    const isVaildPass = await BCRYPT.compare(req.body.password, user._doc.passwordHash)
    if (!isVaildPass) {
      return res.status(400).json({
        message: "не верный логин или пароль"
      })
    }

    const TOKEN = JWT.sign(                     //создание Токена (шифрую id)
      {
        _id: user._id                           //_id по томоу что в Mongo такой синтаксис
      },
      'secret25',                                 // ключ шифрования
      {
        expiresIn: '30d'                        //время жизни Токена
      }
    )

    const { passwordHash, ...userData } = user._doc
    //вытаскиваю пароль и все данные что бы вернуть всё кроме пароля
    res.json({
      message: "логин выполнен",
      ...userData,
      TOKEN
    })
  } catch (err) {
    console.log('ERROR! CANT LOGIN USER : ', err),
      res.status(500).json({
        message: "Не удалось авторизоваться !",
      })
  }
})

app.get('/auth/me', checkAuth, async (req, res) => {  //chekAuth самодельный мидлвеар запрос не сработает без неё
  try {
    const user = await UserModel.findById(req.userId)
    if (!user) {
      return res.status(404).json({
        message: 'пользователь не найден'
      })
    }
    const { passwordHash, ...userData } = user._doc
    //вытаскиваю пароль и все данные что бы вернуть всё кроме пароля
    res.json({
      message: 'пользователь найден',
      ...userData,
    })

  } catch (err) {
    console.log("GET AUTH/ME ERROR! : ", err )
    res.status(500).json({
      message: "Нет доступа"
    })
  }
})

app.listen(2222, (err) => {
  if (err) {
    return console.log("error : ", err)
  }
  console.log("server working")
})
