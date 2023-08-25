const express = require('express')
const colors = require("colors")
const multer = require('multer')
const dotenv = require('dotenv').config()
const {errorHandler} = require("./middleware/errorMiddleware")
const connectDB = require("./config/db")
const cors = require('cors');
const path = require('path');
const PORT  = process.env.PORT || 5000

connectDB()

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use('/images', express.static(path.join(__dirname,'images')));
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'images'),
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    cb(null, originalName);
  }
});

const upload = multer({ storage: storage });
app.get('/' , (req ,res)=>{
  res.status(200).json({
    message:"Welcome to the book share api"
  })
})

app.use('/api/users' ,upload.any() ,require('./routes/userRoutes'))
app.use('/api/books' , upload.any(),require('./routes/bookRoutes'))

app.use(errorHandler)


app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`))