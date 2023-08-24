const express = require("express")
const router = express.Router()
const {createBookRecommendation , deleteBookRecommendation , updateBookRecommendation , likeRecommendation ,unlikeRecommendation } = require("../controllers/bookController")
const {protect} = require("../middleware/authMiddleware")

router.post('/recommendBook' , protect , createBookRecommendation)
router.delete('/deleteRecommendedBook/:id', protect, deleteBookRecommendation);
router.patch('/updateRecommendedBook/:id', protect, updateBookRecommendation);
router.post('/likeRecommended/:recommendationId', protect, likeRecommendation );
router.post('/unlikeRecommended/:partialBookName', protect, unlikeRecommendation );


module.exports = router