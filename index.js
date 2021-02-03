const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require("body-parser");

require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const dbUri = process.env.DB_URI
mongoose.connect(dbUri, {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true
})

const connection = mongoose.connection
connection.once('open', () => {
    console.log('MongoDB connection success')
})

app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})


// Router
const userRouter = require('./routes/user.routes')
const authRoutes = require('./routes/auth.routes')
app.use('/users', userRouter)
app.use('/auth', authRoutes)
