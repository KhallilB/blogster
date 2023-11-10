import { Schema, Document, Model, model } from 'mongoose'

interface IComment extends Document {
  _id: Schema.Types.ObjectId
  content: string
  blog: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
  likes: number
  dislikes: number
}

// Static methods available only on instance methods
interface ICommentDocument extends IComment {}

// Static methods available only on model methods
interface ICommentModel extends Model<ICommentDocument, {}> {}

const BlogSchema = new Schema<IComment, ICommentModel>({
  content: {
    type: String,
    required: true,
  },
  blog: {
    type: Schema.Types.ObjectId,
    ref: 'Blog',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  likes: {
    type: Number,
    required: true,
  },
  dislikes: {
    type: Number,
    required: true,
  },
})

const Comment = model<IComment, ICommentModel>('Comment', BlogSchema)

export default Comment
