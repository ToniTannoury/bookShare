const asyncHandler = require("express-async-handler")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const User = require('../models/userModel')
const  BookRecommendation = require('../models/bookRecommendationModel'); 



const searchUsers = asyncHandler(async (req, res) => {
  const query = req.query.q; 

  try {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }
      ],
    }).populate('recommendations'); 

    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while searching for users' });
  }
});


const registerUser = asyncHandler(async(req , res)=>{
  const {name , email , password } = req.body
  // console.log(req.files)
  if(!name || !email || !password){
    res.status(400)
    throw new Error("Please include all fields")
  }
  console.log(name , email ,password  )
  const userExists = await User.findOne({email})
  console.log(userExists)
  if(userExists){
    res.status(400)
    throw new Error("User already exists")
  }
 
  const salt  = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password , salt)
  console.log(req.files[0])
  const user = await User.create({
    name,
    email, 
    password:hashedPassword,
    pic_url: req.files.length > 0 ? `${req.files[0].originalname}` : 'emptyProfile.png'
  })

  if(user){
    res.status(201).json({
      _id: user._id,
      name:user.name,
      email:user.email,
      pic_url:pic_url ? user.pic_url : 'emptyProfile.png',
      token:generateToken(user._id)
    })
  }else{
    res.status(400)
    throw new Error('Invalid user data')
  }

})

const loginUser = asyncHandler(async(req , res)=>{
  const {email , password} = req.body
  const user = await User.findOne({email})
  if(user && (await bcrypt.compare(password , user.password))){
    res.status(200).json({
      _id: user._id,
      name:user.name,
      email:user.email,
      token:generateToken(user._id)
    })
  }else{
    // 401 is unauthorized
    res.status(401)
    throw new Error("Invalid credentials")
  }
  
})
 
const getMe = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId)
      .populate('following')
      .populate('followers')
      .populate({
        path: 'following',
        populate: {
          path: 'recommendations'
        }
      })
      .populate('recommendations')
      .populate('likedBooks');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user._id,
      email: user.email,
      name: user.name,
      pic_url: user.pic_url,
      following: user.following,
      followers: user.followers,
      recommendedBooks: user.recommendations,
      likedBooks: user.likedBooks
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});


const followUser = asyncHandler(async (req, res) => {
  const { userIdToFollow } = req.params; 
  const userId = req.user._id;
  console.log(111)
  try {
    const userToFollow = await User.findById(userIdToFollow);

    if (!userToFollow) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (userToFollow.followers.includes(userId)) {
      res.status(400).json({ message: 'You are already following this user' });
      return;
    }

  
    await User.findByIdAndUpdate(userId, { $push: { following: userIdToFollow } });
    await User.findByIdAndUpdate(userIdToFollow, { $push: { followers: userId } });

    res.json({ message: 'You are now following the user', user: userToFollow });
  } catch (error) {
    console.error(error);
    res.status(500)
    throw new Error('An error occurred while following the user');
  }
});

const unfollowUser = asyncHandler(async (req, res) => {
  const { userIdToUnfollow } = req.params; 
  const userId = req.user._id;

  try {
    const userToUnfollow = await User.findById(userIdToUnfollow);

    if (!userToUnfollow) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (!userToUnfollow.followers.includes(userId)) {
      res.status(400).json({ message: 'You are not following this user' });
      return;
    }
    await User.findByIdAndUpdate(userId, { $pull: { following: userIdToUnfollow } });
    await User.findByIdAndUpdate(userIdToUnfollow, { $pull: { followers: userId } });

    res.json({ message: 'You have unfollowed the user', user: userToUnfollow });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while unfollowing the user' });
  }
});

const searchFollowingRecommendationsByBookName = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const  partialBookName  = req.params.partialBookName;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const followingUserIds = user.following;
    const followingRecommendations = await BookRecommendation.find({
      createdBy: { $in: followingUserIds },
      bookName: { $regex: partialBookName, $options: 'i' } // Case-insensitive search
    });

    res.json({ recommendations: followingRecommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while searching for recommendations' });
  }
});

const searchFollowingRecommendationsByGenre = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const genre = req.params.genre;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const followingUserIds = user.following;
    
    if (typeof genre !== 'string') {
      res.status(400).json({ message: 'Genre must be a string' });
      return;
    }

    const followingRecommendations = await BookRecommendation.find({
      createdBy: { $in: followingUserIds },
      genre: { $regex: genre, $options: 'i' } 
    });

    res.json({ recommendations: followingRecommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while searching for recommendations' });
  }
});
const searchFollowingRecommendationsByAuthor = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const  authorName  = req.params.authorName;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const followingUserIds = user.following;
    
    if (typeof authorName !== 'string') {
      res.status(400).json({ message: 'Author name must be a string' });
      return;
    }

    const followingRecommendations = await BookRecommendation.find({
      createdBy: { $in: followingUserIds },
      'author.name': { $regex: authorName, $options: 'i' } 
    });

    res.json({ recommendations: followingRecommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while searching for recommendations' });
  }
});
const generateToken = (id)=>{
  return jwt.sign({ id }, process.env.JWT_SECRET , {
    expiresIn: '10d'
  })
}



module.exports = {
  getMe,
  registerUser,
  loginUser,
  followUser,
  unfollowUser,
  searchFollowingRecommendationsByBookName,
  searchFollowingRecommendationsByGenre,
  searchFollowingRecommendationsByAuthor,
  searchUsers
}