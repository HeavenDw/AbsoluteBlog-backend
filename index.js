import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { PostController, UserController } from './controllers/index.js';
import checkAuth from './utils/checkAuth.js';
import handleValidationErrors from './utils/handleValidationErrors.js';
import { loginValidation, registerValidation, postCreateValidation } from './validations.js';

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

//Enable cors
app.use(cors());

//Enable static links for uploads
app.use('/uploads', express.static('uploads'));

//Run server in 4444 port
app.listen(4444, () => {
  console.log('server OK');
});

//User API
app.post('/auth/register/', registerValidation, handleValidationErrors, UserController.register);
app.post('/auth/login/', loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/auth/avatar', checkAuth, UserController.setAvatar);

//Posts API
app.get('/posts/', PostController.getAll);
app.get('/posts/:id', PostController.getPost);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);

//init images upload (multer)
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

//Images upload API
app.post('/upload', checkAuth, upload.single('image'), async (req, res) => {
  res.json({
    url: `/uploads/${req.file.filename}`,
  });
});
