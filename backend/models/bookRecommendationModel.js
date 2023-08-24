const mongoose = require('mongoose');

const bookRecommendationSchema = new mongoose.Schema({
  bookName: {
    type: String,
    required: [true, 'Please add the name of the book']
  },
  author: {
    name: {
      type: String,
      required: [true, 'Please add the author\'s name']
    },
    pic_url: {
      type: String,
      required: [false]
    }
  },
  review: {
    type: String,
    required: [true, 'Please add a review for the book']
  },
  book_pic_url: {
    type: String,
    required: [false]
  },
  genre: {
    type: String,
    required: [true, 'Please add the genre of the book']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add the user who created the recommendation']
  },
  likes: {
    type: Number,
    default: 0
  }
});



module.exports = mongoose.model('BookRecommendation', bookRecommendationSchema);
