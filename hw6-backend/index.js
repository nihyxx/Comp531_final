const express = require("express")
const bodyParser = require("body-parser")
var cookieParser = require('cookie-parser')

const cors = require('cors');
const app = express()
app.use(bodyParser.json())
app.use(cookieParser())
const whitelist = ['http://localhost:3000']
app.get("/", (_, res) => res.send("Hello"));
app.use(cors({
     origin: true,
     credentials: true,
     optionsSuccessStatus: 200
}))
require('./src/auth')(app)
require('./src/profile')(app)
require('./src/articles')(app)
require('./src/following')(app)


// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
     const addr = server.address()
     console.log(`Server listening at http://${addr.address}:${addr.port}`)
})

