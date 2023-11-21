import express from 'express'
import mongoose from 'mongoose'
import checkAuth from './utils/checkAuth.js'
import { registerValidation, loginValidation } from './validations/auth.js'    //обязательно указывать расширение .js
import { postCreateValidation } from './validations/post.js'
import * as UserController  from './controllers/UserControllers.js'   //{ GetMe, Login, Register }
import * as PostController  from './controllers/PostControllers.js' 

mongoose
  .connect('mongodb+srv://webdotg:zxcasdqwe321zxc@first.v5ufhia.mongodb.net/blogbox?retryWrites=true&w=majority')
  .then(() => console.log('DB CONNECT OK!'))
  .catch((err) => console.log('DB CONNECT ERROR! : ', err))

const app = express()
app.use(express.json())                      //для того что бы express приложение понимало json

app.post('/auth/register', registerValidation, UserController.Register)
app.post('/auth/login', loginValidation, UserController.Login)
app.get('/auth/me', checkAuth, UserController.GetMe)            //chekAuth самодельный мидлвеар запрос не сработает без неё

app.get('/posts', PostController.GetAll)
app.get('/posts/:id', PostController.GetOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.Create)
// app.delete('/posts', PostController.Remove)
// app.patch('/posts', PostController.Update)


app.listen(2222, (err) => {
  if (err) {
    return console.log("error : ", err)
  }
  console.log("server working")
})
