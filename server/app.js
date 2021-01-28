const express = require('express')
const mongoose = require('mongoose')
const config = require('config')

const app = express()

const PORT = config.get('port') || 5500

app.use(express.json())
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/files', require('./routes/file.routes'))

const start = async () => {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })

    app.listen(PORT, () => {
      console.log(`Server has been started on port - ${PORT}`)
    })
  } catch (e) {
    console.log('Messgae error -', e.message)
    process.exit(1)
  }
}

start()
