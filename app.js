const express = require('express')
const http = require('http')
const app = express()

const logger = require('morgan')
const path = require('path')
const fs = require('fs')

const port = 4000

const setLogger = () => {
  app.use(logger('dev'))

  const logFile = fs.createWriteStream(path.normalize(`${__dirname}/log/access.log`), { flags: 'a' })
  const format = ':remote-addr [:date[iso]] ":method :url HTTP/:http-version" :status' +
    ' :res[content-length] ":referrer" ":user-agent" :response-time'
  app.use(logger(format, { stream: logFile, skip: false }))
}

setLogger()

app.get('/', (req, res, next) => {
  res.json('test response')
})

app.get('/check', (req, res, next) => {
  http.request('http://node-svc.default.svc.cluster.local:30000', function(response) {
    let returnValue = ''
    response.on('data', (chunk) => {
      returnValue += chunk
    })
    response.on('end', () => {
      res.json(returnValue)
    })
  }).end();
})

app.listen(port, () => console.log(`server is running on ${port} port`))