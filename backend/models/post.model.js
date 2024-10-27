import mongoose from 'mongoose'
const postSchema = new mongoose.Schema({
  caption: { type: String, default: '' },
  image: { type: String, required: false },
  video: { type: String, required: false },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  flagged: { type: Boolean, default: false, required: true },
  flagDetails: { type: Object, required: false },
  disabled: { type: Boolean, default: false },
})
export const Post = mongoose.model('Post', postSchema)
