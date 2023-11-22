import PostModel from '../models/Post.js'

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

  } catch (err) {
    console.log("Ошибка! при создании статьи : ", err)
    res.status(500).json({
      message: "Не удалось создать статью"
    })
  }
}

export const GetAll = async (req, res) => {
  try {

    const posts = await PostModel.find().populate({ path: "user", select: ["name", "avatar", "fullName"] }).exec()
    //.populate('user).exec -- привязываю таблицы а именно  юзера к посту , 
    //{ path: "user", select: ["name", "avatar"] } -- удаляю хэшПароль из ответа
    res.json(posts)

  } catch (err) {
    console.log("Не удалось получить все статьи : ", err)
    res.status(500).json({
      message: "Не удалось получить все статьи"
    })
  }
}

export const GetOne = async (req, res) => {
  try {

    const postId = req.params.id
    //так как при нахождении сатьи нало увеличить счеитчик просмотров
    //использую не findById ,а findByIdAndUpdate
    //вторым параметорм после поиска шв я передаю то что хочу обновить $inc: { viewsCount: 1 }
    //третим параметором говорю что нужно вернуть после обновления уже обновленный документ
    const post = await PostModel.findByIdAndUpdate({
      _id: postId
    }, {
      $inc: { viewsCount: 1 },
    }, {
      returnDocument: 'after'
    },)

    res.json({
      "статья": "создана",
      post
    })

  } catch (err) {
    console.log("Не удалось получить статью : ", err)
    res.status(500).json({
      message: "Не удалось получить статью"
    })
  }
}

export const Remove = async (req, res) => {
  try {
    const postId = req.params.id

    const post = await PostModel.findByIdAndDelete({
      _id: postId
    })

    res.json({
      success: true,
      "статья": "удалена",
    })

  } catch (err) {
    console.log("Не удалось удалить статью : ", err)
    res.status(500).json({
      message: "Не удалось удалить статью"
    })
  }
}