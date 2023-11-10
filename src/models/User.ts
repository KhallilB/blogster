import { Schema, Document, Model, model } from 'mongoose'

interface IUser extends Document {
  _id: Schema.Types.ObjectId
  email: string
  password: string
  username: string
  blogs: Schema.Types.ObjectId[]
  likes: Schema.Types.ObjectId[]
  comments: Schema.Types.ObjectId[]
}

// Static methods available only on instance methods
interface IUserDocument extends IUser {
  comparePassword(candidatePassword: string): Promise<boolean>
}

// Static methods available only on model methods
interface IUserModel extends Model<IUserDocument> {
  findByUsername(username: string): Promise<IUserDocument>
}

const UserSchema = new Schema<IUser, IUserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
})

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  // Hash password
  this.password = await Bun.password.hash(this.password, {
    algorithm: 'bcrypt',
    cost: 10,
  })

  next()
})

// STATICS
// Find user by username
UserSchema.statics.findByUsername = async function (username: string) {
  return await this.findOne({ username })
}

// METHODS
// Compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await Bun.password.verify(candidatePassword, this.password)
}

const User = model<IUser, IUserModel>('User', UserSchema)

export default User
