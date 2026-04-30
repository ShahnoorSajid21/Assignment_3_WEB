const express = require("express")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

router.post('/signup', async(req,res)=>{
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please provide all fields' })
  }
  if (!email.includes('@')) {
   return res.status(400).json({ msg: 'Invalid email' })
  }
  if (password.length < 6) {
    return res.status(400).json({ msg: 'Password must be at least 6 chars' })
  }

  try {
      const checkUser = await User.findOne({ email: email })
    if (checkUser) {
      return res.status(400).json({ msg: 'User already exists' })
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
      const user = await User.create({
      name,
        email,
      password: hash
    })
    const payload = { userId: user._id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
    return res.json({
      token,
      user: {
        id: user._id,
       name: user.name,
       email: user.email
      }
    })
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' })
  }
})

router.post('/login', async (req,res) => {
  const { email, password } = req.body
  if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' })
  }

  try {
      const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' })
    }
     const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return res.status(400).json({ msg: 'Invalid credentials' })
    }

   const payload = { userId: user._id }
   const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
   return res.json({
    token,
      user: {
      id: user._id,
      name: user.name,
      email: user.email
      }
    })
  } catch (err) {
    return res.status('500').json({ msg: 'Server error' })
  }
})

module.exports = router
