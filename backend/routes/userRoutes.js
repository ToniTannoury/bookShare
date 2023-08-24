const express = require("express")
const router = express.Router()
const {registerUser , loginUser , getMe , followUser,unfollowUser , searchFollowingRecommendationsByBookName , searchFollowingRecommendationsByGenre , searchFollowingRecommendationsByAuthor ,  searchUsers} = require("../controllers/userController")
const {protect} = require("../middleware/authMiddleware")

router.post('/' , registerUser)
router.post('/login' , loginUser)
router.get('/me' ,protect , getMe)
router.get('/searchUsers' ,protect ,  searchUsers)
router.post('/follow/:userIdToFollow' ,protect , followUser)
router.post('/unfollow/:userIdToUnfollow' ,protect , unfollowUser)
router.get('/searchFollowingRecommendationsByBookName/:partialBookName' ,protect , searchFollowingRecommendationsByBookName)
router.get('/searchFollowingRecommendationsByGenre/:genre' ,protect , searchFollowingRecommendationsByGenre)
router.get('/searchFollowingRecommendationsByAuthorName/:authorName' ,protect , searchFollowingRecommendationsByAuthor)

module.exports = router