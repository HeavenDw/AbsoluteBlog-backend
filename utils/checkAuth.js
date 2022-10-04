import jwt from 'jsonwebtoken';

//Check user token
export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      //Get user id by token
      const decoded = jwt.verify(token, 'secretKey');

      //Set user id to request userId
      req.userId = decoded._id;
      next();
    } catch (err) {
      return res.status(403).json({
        message: 'Нет доступа',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа',
    });
  }
};
