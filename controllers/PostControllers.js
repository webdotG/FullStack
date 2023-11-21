import PostModel from '../models/Post.js'

export const GetAll = async (req, res) => {
  try {

    const posts = await PostModel.find()
    res.json(posts)

  } catch (err) {
    console.log("Не удалось получить все статьи : ", err)
    res.status(500).json({
      message: "Не удалось получить все статьи"
    })
  }
}

export const Create = async (req, res) => {
  try {
    const document = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,          //req.body то что в теле запроса передаёт юзер
      user: req.userId             //req.userId то что уже есть на бэке после проверки авторизации
    })

    const post = await document.save()
    res.json(post)

  }catch (err) {
    console.log("Ошибка! при создании статьи : " ,err)
    res.status(500).json({
      message: "Не удалось создать статью"
    })
  }
}