import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../lib/generateToken.js'
/*================================================================
CREATE NEW SUER
@desc   Create new user
@route  POST /api/users
@access Public
================================================================*/
const create = async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      about: user.about,
      token: generateToken(user._id),
    })
  } catch (error) {
    return res.status(400).json({ error: error })
  }
}

/*================================================================
LIST ALL USERS
@desc   List all users
@route  GET /api/users
@access Public
================================================================*/
const list = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('name email createdAt updatedAt')
  if (users) return res.status(200).json(users)
  else {
    res.status(401)
    throw new Error('No users found')
  }
})

/*================================================================
Read single user
@desc   Get a single user details
@route  GET /api/users/:id
@access Public
================================================================*/
const read = async (req, res) => {
  const user = await User.findById(req.user.id)

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      about: user.about,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
}

/*================================================================
UPDATE USER PROFILE
@desc   Update user profile
@route  PUT /api/users/:id
@access Private
================================================================*/
const update = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.about = req.body.about || user.about
    if (req.body.password) {
      user.password = req.body.password
    }
    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      about: updatedUser.about,
      updatedAt: updatedUser.updatedAt,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})
/*================================================================
DELETE USER PROFIEL
@desc   Delete user profile
@route  delete /api/users/:id
@access Private
================================================================*/
const remove = asyncHandler(async (req, res) => {
  const user = req.user
  console.log(user)
  const deletedUser = await user.remove()
  if (deletedUser) {
    res.status(200).json({ message: 'User deleted successflly' })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
})

/*================================================================
loading User by ID
================================================================*/
// const userByID = async (req, res, next, id) => {
//   try {
//     const user = await User.findById(id)
//     if (!user) {
//       return res.status(400).json({
//         error: 'User not found',
//       })
//     }
//     req.user = user
//     next()
//   } catch (error) {
//     res.status(400).json({
//       error: 'Could not retrive user',
//     })
//   }
// }

/*============================================================================
@desc   Auth the User
@route  POST /api/users/login
@access Public
=============================================================================*/
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email: email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      about: user.about,
      token: generateToken(user._id),
    })
  } else if (user && !(await user.matchPassword(password))) {
    res.status(401)
    throw new Error('Password is incorrect!')
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})
/*============================================================================
@desc   Get User profile
@route  GET /api/users/profile
@access Private
=============================================================================*/
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      about: user.about,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export default {
  create,
  list,

  read,
  update,
  remove,
  authUser,
  getUserProfile,
}
