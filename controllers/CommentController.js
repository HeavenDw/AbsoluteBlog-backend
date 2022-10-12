import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';

export const create = async (req, res) => {
  try {
    const postId = req.body.postId;

    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
      postId,
    });

    await PostModel.findByIdAndUpdate(
      {
        _id: postId,
      },
      { $inc: { commentsCount: 1 } },
    );

    const comment = await doc.save();

    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось добавить комментарий',
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const postId = req.query.postId;

    if (postId) {
      const comments = await CommentModel.find({ postId }).populate('user').exec();

      return res.json(comments);
    }
    const comments = await CommentModel.find().limit(5).populate('user').exec();

    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить комментарии',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const commentId = req.body._id;

    await PostModel.findByIdAndUpdate(
      {
        _id: req.body.postId,
      },
      { $inc: { commentsCount: -1 } },
    );

    CommentModel.findByIdAndDelete(
      {
        _id: commentId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось удалить комментарий',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Комментарий не найдена',
          });
        }

        res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить комментарий',
    });
  }
};

export const update = async (req, res) => {
  try {
    const commentId = req.body._id;

    CommentModel.findByIdAndUpdate(
      {
        _id: commentId,
      },
      {
        text: req.body.text,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось обновить комментарий',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Комментарий не найдена',
          });
        }

        res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить комментарий',
    });
  }
};
