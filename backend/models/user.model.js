import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    gender: { type: String, enum: ['male', 'female'] },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    flaggedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    flaggedComments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    loginIps: [{ type: String }, { timestamps: true }],
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true }
)
export const User = mongoose.model('User', userSchema)