import {body} from 'express-validator'

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),              //если в теле запроса есть email то провадидируй его .isEmail()
  body('text', 'Статья не может быть без слов').isLength({min: 10}).isString(),
  body('tags', 'Не верный формат тегов укажите ".../массив"').optional().isString(),
  body('imageUrl', 'Не верная ссылка на изображение').optional().isString(), //.optioanl автарки может не быть но если есть ссылка это или нет
]