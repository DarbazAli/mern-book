import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: 'Email already exists',
      match: [/.+\@.+\..+/, 'Please enter a valid email address'],
      required: 'Email is required',
    },

    name: {
      type: String,
      required: 'Name is required',
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    about: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
      default: '/uploads/default.jpeg',
    },
    following: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    followers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  // check if the password is modified
  // if password is not been modifed, just move on
  if (!this.isModified('password')) {
    next()
  }

  // else, hash the new passowrd
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

export default mongoose.model('User', userSchema)
