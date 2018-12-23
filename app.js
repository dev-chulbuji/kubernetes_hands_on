const express = require('express')
const app = express()

const logger = require('morgan')
const path = require('path')
const fs = require('fs')

const setLogger = () => {
  app.use(logger('dev'))

  const logFile = fs.createWriteStream(path.normalize(`${__dirname}/log/access.log`), { flags: 'a' })
  const format = ':remote-addr [:date[iso]] ":method :url HTTP/:http-version" :status' +
    ' :res[content-length] ":referrer" ":user-agent" :response-time'
  app.use(logger(format, { stream: logFile, skip: false }))

}

setLogger()

app.get('*', (req, res, next) => {
  res.json('test response')
})

app.listen(3000, () => console.log('server is running on 3000 port'))