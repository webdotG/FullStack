import JWT from 'jsonwebtoken'

 //next нужен что бы завершить работу этой функции и позволть GET сделать запрос
export default (req, res, next) => {     
  const TOKEN = (req.headers.authorization || '' ).replace(/Bearer\s?/, '');
  if (TOKEN) {
    try {
      const decoded = JWT.verify(TOKEN, 'secret25')

      req.userId = decoded._id

      next()           //если токен получен и расшифрован то можно выполнять следующую функцию
    } catch (err) {

      return res.status(403).json({
        message: "доступ отсутствует"
      })
    }

  } else {
    return res.status(403).json({
      message: "доступ отсутствует"
    })
  }
  
}