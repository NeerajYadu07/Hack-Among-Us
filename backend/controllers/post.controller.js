import sharp from 'sharp'
import cloudinary from '../utils/cloudinary.js'
import { Post } from '../models/post.model.js'
import { User } from '../models/user.model.js'
import { Comment } from '../models/comment.model.js'
import { getReceiverSocketId, io } from '../socket/socket.js'
import { analyzeData, analyzeText, uploadToGemini } from './model.js'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import { log } from 'console'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body
    const media = req.file
    const authorId = req.id

    if (!media) return res.status(400).json({ message: 'Media file required' })

    // Determine media type and save to local folder
    const mediaType = media.mimetype.startsWith('image')
      ? 'image'
      : media.mimetype.startsWith('video')
      ? 'video'
      : null
    if (!mediaType)
      return res.status(400).json({ message: 'Unsupported media type' })

    const mediaFolder = path.join(
      __dirname,
      mediaType === 'image' ? 'images' : 'videos'
    )
    if (!fs.existsSync(mediaFolder))
      fs.mkdirSync(mediaFolder, { recursive: true })

    const filePath = path.join(
      mediaFolder,
      `${Date.now()}_${media.originalname}`
    )
    fs.writeFileSync(filePath, media.buffer)

    // Resize images if needed
    if (mediaType === 'image') {
      const optimizedImageBuffer = await sharp(media.buffer)
        .resize({ width: 800, height: 800, fit: 'inside' })
        .toFormat('jpeg', { quality: 80 })
        .toBuffer()
      fs.writeFileSync(filePath, optimizedImageBuffer)
    }

    // Upload the saved file to Gemini
    const mediaFiles = [await uploadToGemini(filePath, media.mimetype)]

    // Upload to Cloudinary with the correct resource_type
    const cloudResponse = await cloudinary.uploader.upload(filePath, {
      resource_type: mediaType === 'video' ? 'video' : 'image',
    })
    const cloudinaryUrl = cloudResponse.secure_url // Get the secure URL for image or video
    console.log(cloudinaryUrl)

    const analysisResult = await analyzeData(mediaFiles, caption)

    // Create the post
    const post = await Post.create({
      caption,
      image: mediaType === 'image' ? cloudinaryUrl : null,
      video: mediaType === 'video' ? cloudinaryUrl : null,
      author: authorId,
      flagged:
        analysisResult.image.probability > 0.5 ||
        analysisResult.text.probability > 0.5,
      flagDetails: analysisResult,
    })
    await post.populate({ path: 'author', select: '-password' })

    const user = await User.findById(authorId)
    if (user) {
      user.posts.push(post._id)
      if (post.flagged) {
        user.flaggedPosts.push(post._id)
      }
      await user.save()
    }

    return res.status(201).json({
      message: 'New post added',
      post,
      success: true,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Server error' })
  }
}
export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find({ disabled: false })
      .sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'username profilePicture' })
      .populate({
        path: 'comments',
        sort: { createdAt: -1 },
        populate: {
          path: 'author',
          select: 'username profilePicture',
        },
      })
    return res.status(200).json({
      posts,
      success: true,
    })
  } catch (error) {
    console.log(error)
  }
}

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'author',
        select: 'username, profilePicture',
      })
      .populate({
        path: 'comments',
        sort: { createdAt: -1 },
        populate: {
          path: 'author',
          select: 'username, profilePicture',
        },
      })
    return res.status(200).json({
      posts,
      success: true,
    })
  } catch (error) {
    console.log(error)
  }
}

export const disablePost = async (req, res) => {
  try {
    const id = req.body.id
    console.log(id)

    const post = await Post.findByIdAndUpdate(id, { disabled: true })
    if (!post) {
      return res.status(400).json({
        message: 'No such post',
      })
    }

    return res.status(200).json({ message: 'Success' })
  } catch (error) {
    console.log(error)
  }
}

export const likePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id
    const postId = req.params.id
    const post = await Post.findById(postId)
    if (!post)
      return res.status(404).json({ message: 'Post not found', success: false })

    // like logic started
    await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } })
    await post.save()

    // implement socket io for real time notification
    const user = await User.findById(likeKrneWalaUserKiId).select(
      'username profilePicture'
    )

    const postOwnerId = post.author.toString()
    if (postOwnerId !== likeKrneWalaUserKiId) {
      // emit a notification event
      const notification = {
        type: 'like',
        userId: likeKrneWalaUserKiId,
        userDetails: user,
        postId,
        message: 'Your post was liked',
      }
      const postOwnerSocketId = getReceiverSocketId(postOwnerId)
      io.to(postOwnerSocketId).emit('notification', notification)
    }

    return res.status(200).json({ message: 'Post liked', success: true })
  } catch (error) {}
}
export const dislikePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id
    const postId = req.params.id
    const post = await Post.findById(postId)
    if (!post)
      return res.status(404).json({ message: 'Post not found', success: false })

    // like logic started
    await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } })
    await post.save()

    // implement socket io for real time notification
    const user = await User.findById(likeKrneWalaUserKiId).select(
      'username profilePicture'
    )
    const postOwnerId = post.author.toString()
    if (postOwnerId !== likeKrneWalaUserKiId) {
      // emit a notification event
      const notification = {
        type: 'dislike',
        userId: likeKrneWalaUserKiId,
        userDetails: user,
        postId,
        message: 'Your post was liked',
      }
      const postOwnerSocketId = getReceiverSocketId(postOwnerId)
      io.to(postOwnerSocketId).emit('notification', notification)
    }

    return res.status(200).json({ message: 'Post disliked', success: true })
  } catch (error) {}
}
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id
    const commentKrneWalaUserKiId = req.id

    const { text } = req.body

    const analysisResult = await analyzeText(text)

    console.log(analysisResult)

    const post = await Post.findById(postId)

    if (!text)
      return res
        .status(400)
        .json({ message: 'text is required', success: false })

    const comment = await Comment.create({
      text,
      author: commentKrneWalaUserKiId,
      post: postId,
      flagged:
        analysisResult.image.probability > 0.5 ||
        analysisResult.text.probability > 0.5,
      flagDetails: analysisResult,
    })

    await comment.populate({
      path: 'author',
      select: 'username profilePicture',
    })


    await post.save()
    
    const user = await User.findById(comment.author._id)
    if (user) {
      post.comments.push(comment._id)
      if (comment.flagged) {
        user.flaggedComments.push(comment._id)
      }
      await user.save()
    }

    return res.status(201).json({
      message: 'Comment Added',
      comment,
      success: true,
    })
  } catch (error) {
    console.log(error)
  }
}

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id

    const comments = await Comment.find({ post: postId }).populate(
      'author',
      'username profilePicture'
    )

    if (!comments)
      return res.status(404).json({
        message: 'No comments found for this post',
        success: false,
      })

    return res.status(200).json({ success: true, comments })
  } catch (error) {
    console.log(error)
  }
}
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id
    const authorId = req.id

    const post = await Post.findById(postId)
    if (!post)
      return res.status(404).json({ message: 'Post not found', success: false })

    // check if the logged-in user is the owner of the post
    if (post.author.toString() !== authorId)
      return res.status(403).json({ message: 'Unauthorized' })

    // delete post
    await Post.findByIdAndDelete(postId)

    // remove the post id from the user's post
    let user = await User.findById(authorId)
    user.posts = user.posts.filter((id) => id.toString() !== postId)
    await user.save()

    // delete associated comments
    await Comment.deleteMany({ post: postId })

    return res.status(200).json({
      success: true,
      message: 'Post deleted',
    })
  } catch (error) {
    console.log(error)
  }
}
export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id
    const authorId = req.id
    const post = await Post.findById(postId)
    if (!post)
      return res.status(404).json({ message: 'Post not found', success: false })

    const user = await User.findById(authorId)
    if (user.bookmarks.includes(post._id)) {
      // already bookmarked -> remove from the bookmark
      await user.updateOne({ $pull: { bookmarks: post._id } })
      await user.save()
      return res.status(200).json({
        type: 'unsaved',
        message: 'Post removed from bookmark',
        success: true,
      })
    } else {
      // bookmark krna pdega
      await user.updateOne({ $addToSet: { bookmarks: post._id } })
      await user.save()
      return res.status(200).json({
        type: 'saved',
        message: 'Post bookmarked',
        success: true,
      })
    }
  } catch (error) {
    console.log(error)
  }
}
