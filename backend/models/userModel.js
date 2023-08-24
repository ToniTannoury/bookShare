const mongoose = require('mongoose') 

const userSchema = mongoose.Schema({
  name:{
    type:String,
    required:[true , 'Please add a name']
  },
  email:{
    type:String,
    required:[true , 'Please add an email'],
    unique:true
  },
  password:{
    type:String,
    required:[true , 'Please add a password'],
  },
  pic_url:{
    type:String,
    required:[false],
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  recommendations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookRecommendation'
    }
  ],
  likedBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookRecommendation'
    }
  ],
},
{
  timestamps:true
})

module.exports = mongoose.model('User' , userSchema)