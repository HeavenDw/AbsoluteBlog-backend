import { body } from 'express-validator';

//Data validation when user try to login
export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
];

//Data validation when user try to regisetr
export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
  body('nickname', 'Укажите имя').isLength({ min: 3 }),
];

//Data validation when user try to create a post
export const postCreateValidation = [
  body('title', 'Заголовок должен быть минимум 5 символов').isLength({ min: 5 }).isString(),
  body('text', 'Текст должен быть минимум 5 символов').isLength({ min: 5 }).isString(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];
