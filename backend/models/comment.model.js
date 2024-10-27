import mongoose from 'mongoose'
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  flagged: { type: Boolean, default: false, required: true },
  flagDetails: { type: Object, required: false },
  disabled: { type: Boolean, default: false },
})
export const Comment = mongoose.model('Comment', commentSchema)
