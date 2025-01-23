const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password should be at least 6 characters']
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
})

// Hash password sebelum save
userSchema.pre('save', async function(next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

// Generate JWT token
userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET || 'rahasia123', // Fallback secret key
    { expiresIn: '7d' }
  )

  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

// Verify password
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password)
}

// Remove sensitive data when sending user object
userSchema.methods.toJSON = function() {
  const user = this.toObject()
  delete user.password
  delete user.tokens
  return user
}

const User = mongoose.model('User', userSchema)

module.exports = User