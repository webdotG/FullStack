import mongoose from 'mongoose'

//необходтио создать схему нашей таблицы
const UserSchema = new mongoose.Schema({
  fullName : {type: String, required: true},           //required флаг обязательного поля для заполнения
  email : {type: String, required: true, unique: true},
  passwordHash : {type: String, required: true},
  avatarUrl: String,                                   //required отстутсвует значит avatar можеь и не быть
},
{
  timestamps: true             //говорит что обязательно создание даты при создании и изменении юзера                  
},
)

export default mongoose.model('User', UserSchema)