import { Schema, Document, Model, model } from 'mongoose'

interface IBlog extends Document {
  _id: Schema.Types.ObjectId
  title: string
  author: Schema.Types.ObjectId
  content: string
  tags: string[]
  likes: number
  comments: Schema.Types.ObjectId[]
}

// Static methods available only on instance methods
interface IBlogDocument extends IBlog {
  getAuthor(): Promise<IBlog>
  getComments(): Promise<IBlog>
  incrementLikes(): Promise<IBlog>
  decrementLikes(): Promise<IBlog>
}

// Static methods available only on model methods
interface IBlogModel extends Model<IBlogDocument, {}> {
  findBlogsWithTags(tags: string[]): Promise<IBlog[]>
  findBlogsWithAuthor(author: string): Promise<IBlog[]>
}

const BlogSchema = new Schema<IBlog, IBlogModel>({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
    },
  ],
  likes: {
    type: Number,
    required: true,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
})

// STATICS

// Find blogs with matching tags
BlogSchema.statics.findBlogsWithTags = function (tags: string[]) {
  return this.find({ tags: { $in: tags } })
}

// Find blogs with author
BlogSchema.statics.findBlogsWithAuthor = function (id: string) {
  return this.find({ author: id })
}

// METHODS

// Get author of blog
BlogSchema.methods.getAuthor = function () {
  return this.populate('author').execPopulate()
}

// Get comments of blog
BlogSchema.methods.getComments = function () {
  return this.populate('comments').execPopulate()
}

// Increment likes of blog
BlogSchema.methods.incrementLikes = function () {
  this.likes += 1
  return this.save()
}

// Decrement likes of blog
BlogSchema.methods.decrementLikes = function () {
  this.likes -= 1
  return this.save()
}

const Blog = model<IBlog, IBlogModel>('Blog', BlogSchema)

export default Blog
