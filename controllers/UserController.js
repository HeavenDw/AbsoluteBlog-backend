import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

//Register user
export const register = async (req, res) => {
  try {
    //Encrypting password
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //server url
    const fullUrl = 'https://' + req.get('host');

    //Create new user modele
    const doc = new UserModel({
      email: req.body.email,
      passwordHash: hash,
      nickname: req.body.nickname,
      avatarUrl: `${fullUrl}/uploads/no-avatar.png`,
    });

    const user = await doc.save();

    //Create token for new user
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secretKey',
      {
        expiresIn: '30d',
      },
    );

    //Get data besides passwordHash
    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err.message);
    if (err.message.includes('email_1')) {
      return res.status(500).json({
        message: 'Email уже зарегистрирован',
      });
    }
    if (err.message.includes('nickname_1')) {
      return res.status(500).json({
        message: 'Nickname уже зарегистрирован',
      });
    }
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};

//Login user
export const login = async (req, res) => {
  try {
    //Get user from db by email
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        message: 'Неправильный логин или пароль',
      });
    }

    //Compare password hash from request and from db
    const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPassword) {
      return res.status(400).json({
        message: 'Неправильный логин или пароль',
      });
    }

    //Create new token for current user
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secretKey',
      {
        expiresIn: '30d',
      },
    );

    //Get data besides passwordHash
    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

//Return current user data
export const getMe = async (req, res) => {
  try {
    //Get user from db by id
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    //Get data besides passwordHash
    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: 'Пользователь не найден',
    });
  }
};

//Set user avatar
export const setAvatar = async (req, res) => {
  try {
    //Find user from db by id and update avatarUrl
    await UserModel.updateOne(
      {
        _id: req.userId,
      },
      {
        avatarUrl: req.body.imageUrl,
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось установить аватар',
    });
  }
};
