import mongoose from 'mongoose'

//необходтио создать схему нашей таблицы
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true                          //required флаг обязательного поля для заполнения
  },
  text: {
    type: String,
    required: true,
    unique: true
  },
  tags: {
    type: Array,
    default: []                              //если теги не указаны то создаётся пустой массив
  },
  viewsCount: {                             //счетчик просмотра статей
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,   //автор статьи в BD записан в mongoose.Schema.Types.ObjectId 
    ref: 'User',                     //ссылается на МОДЕЛЬ ЮЗЕР relationsheep/связь между жвумя таблицами
    required: true
  },
  imageUrl: String,                        //required отстутсвует значит avatar можеь и не быть
},
  {
    timestamps: true             //говорит что обязательно создание даты при создании и изменении статьи                  
  },
)

export default mongoose.model('Post', PostSchema)