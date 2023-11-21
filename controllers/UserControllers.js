import JWT from 'jsonwebtoken'
import BCRYPT from 'bcrypt'
import { validationResult } from 'express-validator'
import UserModel from "../models/User.js"              //обязательно указывать расширение .js

export const Register = async (req, res) => {
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
}

export const Login = async (req, res) => {
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
}

export const GetMe = async (req, res) => {  
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
}