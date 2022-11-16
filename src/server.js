const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const filesRouter = require('./routes/files.route')

const app = express()
const port = 4200

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.json({ 'message': 'ok' })
})

app.use('/files', filesRouter)

app.use((err, req, res, next) => {
  console.log("ERR----", err)
  const statusCode = err.statusCode || 500
  console.error(err.message, err.stack)
  res.status(statusCode).json({ 'message': err.message })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
