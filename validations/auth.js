import {body} from 'express-validator'

export const registerValidation = [
  body('email', 'Не верный формат почты').isEmail(),              //если в теле запроса есть email то провадидируй его .isEmail()
  body('password', 'Пароль минимум 5 символов').isLength({min: 5}),
  body('fullName', 'Имя минимум 3 символа').isLength({min: 3}),
  body('avatarUrl', 'Не верная ссылка на аватарку').optional().isURL(), //.optioanl автарки может не быть но если есть ссылка это или нет
]