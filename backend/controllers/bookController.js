const  User = require('../models/userModel'); 
const  BookRecommendation = require('../models/bookRecommendationModel'); 
const asyncHandler = require("express-async-handler")
const mongoose = require("mongoose")
const createBookRecommendation = asyncHandler(async (req, res) => {
  const authorPicFile = req.files.find(file => file.fieldname === 'authorPic');
  const bookPicFile = req.files.find(file => file.fieldname === 'book_pic_url');
  console.log(req.files)

  const authorPic = authorPicFile ? authorPicFile.originalname : null;
  const book_pic_url = bookPicFile ? bookPicFile.originalname : null;


  const { bookName, authorName, review, genre } = req.body;

  const createdBy = req.user;

  try {
    const newRecommendation = await BookRecommendation.create({
      bookName,
      author:{
        name:authorName,
        pic_url:authorPic
      },
      review,
      book_pic_url:book_pic_url,
      genre,
      createdBy
    });

  
    await User.findByIdAndUpdate(createdBy, { $push: { recommendations: newRecommendation._id } });

    res.status(201).json({ message: 'Book recommendation created successfully', recommendation: newRecommendation });
  } catch (error) {
    console.log(error)
    res.status(500)
    throw new Error('An error occurred while creating the recommendation');
  }
});

const deleteBookRecommendation = asyncHandler(async (req, res) => {
  const recommendationId = req.params.id;
  const userId = req.user._id;

  try {
    const recommendation = await BookRecommendation.findById(recommendationId);

    if (!recommendation) {
      res.status(404).json({ message: 'Recommendation not found' });
      return;
    }
    if (!recommendation.createdBy.equals(userId)) {
      res.status(403)
      throw new Error('You are not authorized to delete this recommendation' );
     
    }
    console.log(recommendation)
    await recommendation.deleteOne(); 

    await User.findByIdAndUpdate(userId, { $pull: { recommendations: recommendationId } });

   res.json({message:('Recommendation deleted successfully' )});
  } catch (error) {
    throw new Error('An error occurred while deleting the recommendation' );
  }
});
const updateBookRecommendation = asyncHandler(async (req, res) => {
  const recommendationId = req.params.id;
  const userId = req.user._id;
  const authorPicFile = req.files.find(file => file.fieldname === 'authorPic');
  const bookPicFile = req.files.find(file => file.fieldname === 'book_pic_url');
  console.log(req.files)

  const authorPic = authorPicFile ? authorPicFile.originalname : null;
  const book_pic_url = bookPicFile ? bookPicFile.originalname : null;


  const { bookName, authorName, review, genre } = req.body;
  const author = {
    name : authorName,
    pic_url:authorPic
  }
  try {
    const recommendation = await BookRecommendation.findById(recommendationId);

    if (!recommendation) {
      res.status(404).json({ message: 'Recommendation not found' });
      return;
    }

    if (!recommendation.createdBy.equals(userId)) {
      res.status(403).json({ message: 'You are not authorized to update this recommendation' });
      return;
    }
    console.log(recommendation)
    recommendation.bookName = bookName ? bookName : recommendation.bookName;
    recommendation.author.name = author.name ? author.name :  recommendation.author.name;
    recommendation.author.pic_url = author.pic_url ? author.pic_url :  recommendation.author.pic_url;
    recommendation.review = review ? review : recommendation.review;
    recommendation.book_pic_url = book_pic_url ? book_pic_url : recommendation.book_pic_url;
    recommendation.genre = genre ? genre : recommendation.genre;
    console.log(recommendation)
    const updatedRecommendation = await recommendation.save();

    res.json({ message: 'Recommendation updated successfully', recommendation: updatedRecommendation });
  } catch (error) {
    console.error(error);
    res.status(500)
    throw new Error('An error occurred while updating the recommendation');
  }
});
const likeRecommendation = asyncHandler(async (req, res) => {
  const  recommendationId  = req.params.recommendationId.trim();
  const userId = req.user._id;

  try {
   
    const recommendation = await BookRecommendation.findById(recommendationId);
    if (!recommendation) {
      res.status(404).json({ message: 'Recommendation not found' });
      return;
    }
   
    const creator = await User.findById(recommendation.createdBy);
    if (!creator.followers.includes(userId)) {
      res.status(403).json({ message: 'You are not authorized to like this recommendation' });
      return;
    }
    const user = await User.findById(userId);
    if (user.likedBooks.includes(recommendationId)) {
      res.status(400).json({ message: 'You have already liked this recommendation' });
      return;
    }
    recommendation.likes += 1;
    await recommendation.save();
    user.likedBooks.push(recommendationId);
    await user.save();

    res.json({ message: 'You have liked the recommendation', recommendation });
  } catch (error) {
    console.error(error);
    res.status(500)
    throw new Error('An error occurred while liking the recommendation' );
  }
});

const unlikeRecommendation = asyncHandler(async (req, res) => {
  console.log(req.params)
  const recommendationId = req.params.partialBookName.trim();
  const userId = req.user._id;

  try {
    console.log(recommendationId)
    const recommendation = await BookRecommendation.findById(recommendationId);
    if (!recommendation) {
      res.status(404).json({ message: 'Recommendation not found' });
      return;
    }
    recommendation.likes -= 1;
    await recommendation.save();

    const user = await User.findById(userId);
    console.log(user.likedBooks)
    if (!user.likedBooks.includes(recommendationId)) {
      res.status(400).json({ message: 'You have not liked this recommendation' });
      return;
    }

    user.likedBooks.pull(recommendationId);
    await user.save();

    res.json({ message: 'You have unliked the recommendation', recommendation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while unliking the recommendation' });
  }
});

module.exports = {
  createBookRecommendation,
  deleteBookRecommendation,
  updateBookRecommendation,
  likeRecommendation,
  unlikeRecommendation
};
