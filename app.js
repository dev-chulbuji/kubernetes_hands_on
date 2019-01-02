const express = require('express')
const http = require('http')
const app = express()

const logger = require('morgan')
const path = require('path')
const fs = require('fs')
const request = require('request')

const port = 4000

const setLogger = () => {
  app.use(logger('dev'))

  const logFile = fs.createWriteStream(path.normalize(`${__dirname}/log/access.log`), { flags: 'a' })
  const format = `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`
  app.use(logger(format, { stream: logFile, skip: false }))
}

setLogger()

app.get('/', (req, res, next) => {
  res.json('test response')
})

app.get('/check', async (req, res, next) => {
  const url = `http://nodeapp-svc.default.svc.cluster.local:3000`  
  await request.get(url, { timeout: 3000 }, (err, r, body) => {
    if (err) return res.json(JSON.stringify(err))   
    return res.json(body)
  })
})

app.listen(port, () => console.log(`server is running on ${port} port`))