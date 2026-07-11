import express from "express"
import ReviewsCtrl from "./reviews.controller.js "

const router = express.Router()

router.route("/movie/:id").get(ReviewsCtrl.apiGetReviews) // ":" means can be anything in here and is a variable called id
router.route("/new").post(ReviewsCtrl.apiPostReview)
router.route("/:id") // different path
    .get(ReviewsCtrl.apiGetReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview)

export default router
