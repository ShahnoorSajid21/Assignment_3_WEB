const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./middleware/logger')

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
app.use(logger)

app.get('/', (req,res) => {
  res.send('API Running')
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/simulations', require('./middleware/auth'), require('./routes/simulations'))

const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('MongoDB connected')
    app.listen(PORT, ()=> {
      console.log(`Server started at ${PORT}`)
    })
}).catch((err)=>{
  console.log('DB connection issue', err.message)
})
