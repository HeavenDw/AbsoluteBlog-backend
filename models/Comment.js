import mongoose from 'mongoose';

//Comment shema in data base
const CommentShema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Comment', CommentShema);
