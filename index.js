import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'      // для загрузки картинок
import { registerValidation, loginValidation } from './validations/auth.js'    //обязательно указывать расширение .js
import { postCreateValidation } from './validations/post.js'
import { validationErrors, checkAuth } from './utils/index.js'
import { UserController, PostController } from './controllers/index.js'

mongoose
  .connect('mongodb+srv://webdotg:zxcasdqwe321zxc@first.v5ufhia.mongodb.net/blogbox?retryWrites=true&w=majority')
  .then(() => console.log('DB CONNECT OK!'))
  .catch((err) => console.log('DB CONNECT ERROR! : ', err))

const app = express()
app.use(express.json())                      //для того что бы express приложение понимало json
app.use('/uploads', express.static('uploads')) //для вытаскиывания статичных файлоф по ссылке

const storage = multer.diskStorage({         //хранилище для всех картинок
  destination: (req , file , callBack) => {         
    callBack(null, 'uploads')             //обьяснил путь хранения картинок
  },
  filename: (req , file, callBack) => {         //функция для именования файла
    callBack(null, file.originalname)
  },
})
const upload = multer({ storage })

app.post('/auth/register', registerValidation, validationErrors, UserController.Register)
app.post('/auth/login', loginValidation, validationErrors, UserController.Login)
app.get('/auth/me', checkAuth, UserController.GetMe)            //chekAuth самодельный мидлвеар запрос не сработает без неё

app.get('/posts', PostController.GetAll)
app.get('/posts/:id', PostController.GetOne)
app.post('/posts', checkAuth, postCreateValidation,  PostController.Create)
app.delete('/posts/:id', checkAuth, PostController.Remove)
app.patch('/posts/:id', checkAuth, postCreateValidation,  PostController.Update)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  })
})


app.listen(2222, (err) => {
  if (err) {
    return console.log("error : ", err)
  }
  console.log("server working")
})
