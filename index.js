require('dotenv').config()
const express = require('express')
const app = express()
const connectDB = require('./connect')
const productRouter = require('./routes/product')
const cors = require('cors')

const port = process.env.PORT
connectDB()
app.use(cors({origin:'http://localhost:5173'}))
app.use(express.json())
app.use('/', productRouter)

app.listen(port, ()=>{
    console.log(`Application is up and running on port ${port}`)
})
// CRUD
// C - create - POST
// R - read - GET
// U - update - PATCH / PUT
// D - delete - DELETE