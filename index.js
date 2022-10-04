import express from 'express';
import mongoose from 'mongoose';

import * as UserController from './contollers/UserController.js';
import CheckAuth from './utils/CheckAuth.js';

//connect to mongodb
mongoose
  .connect(
    'mongodb+srv://svntsvntsvn:Ko8qgIlX2eiNiqfx@cluster0.b2mlu1l.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => {
    console.log('DB ok');
  })
  .catch((err) => console.log('DB error', err));

//init express app
const app = express();

//Enable express to read json
app.use(express.json());

//Enable static links for uploads
app.use('/uploads', express.static('uploads'));

//Run server in 4444 port
app.listen(4444, () => {
  console.log('server OK');
});

//User API
app.post('/auth/register/', UserController.register);
app.post('/auth/login/', UserController.login);
app.get('/auth/me', CheckAuth, UserController.getMe);
app.post('/auth/avatar', CheckAuth, UserController.setAvatar);
