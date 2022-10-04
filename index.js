import express from 'express';
import mongoose from 'mongoose';

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

//Run server in 4444 port
app.listen(4444, () => {
  console.log('server OK');
});
