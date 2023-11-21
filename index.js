import express from 'express'
import JWT from 'jsonwebtoken'
import BCRYPT from 'bcrypt'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'
import { registerValidation } from './validations/auth.js'    //обязательно указывать расширение .js
import UserModel from "./models/User.js"

mongoose
  .connect('mongodb+srv://webdotg:zxcasdqwe321zxc@first.v5ufhia.mongodb.net/blogbox?retryWrites=true&w=majority')
  .then(() => console.log('DB CONNECT OK !'))
  .catch((err) => console.log('DB CONNECT ERROR : ', err))

const app = express()
app.use(express.json())                      //для того что бы express приложение понимал json


app.post('/auth/register', registerValidation, async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).json(errors.array())
  }

  const passwordNoHash = req.body.password
  const SALT = await BCRYPT.genSalt(10)
  const passwordHash = await BCRYPT.hash(passwordNoHash, SALT)

  const document = new UserModel({
    email: req.body.email,
    fullName: req.body.fullName,
    passwordHash: passwordHash,
    avatarUrl: req.body.avatarUrl
  })
  const user = await document.save()

  res.json({
    success : true,
    "валидация" : "пройдена",
  })
})

app.listen(2222, (err) => {
  if (err) {
    return console.log("error : ", err)
  }
  console.log("server working")
})


// app.post('/auth/login', (req, res) => {
//   // console.log("POST /auth/login req.body : ", req.body)
//   //когда придёт запрос генерю токен и передаю в него инфу .sign() которую буду шифровать
//   //можно придумать любой ключ для шифровки для примера "secret25"  

//   if (req.body.email === 'test@test') {
//     const token = JWT.sign(
//       {
//         email: req.body.email,
//         fullName: "Кирилл Грант"
//       },
//       "secret25"
//     );
//   }

//   res.json({
//     sucsess: true,
//     token
//     // https://jwt.io/  token можно расшифровать и посмотреть что пришло
//     // "res.json" : "можнописать что угодно",
//   })

// })
