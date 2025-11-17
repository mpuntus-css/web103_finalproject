import express from "express"
import  {
    createReview,
    getReviews,
    getReviewByID,
    getReviewsByUser,
    getReviewsByWatch,
    updateReview, 
    deleteReview


} from '../controllers/reviewController.js'

const router = express.Router();

router.post("/", createReview);
router.get("/", getReviews);
router.get("/:id", getReviewByID);
router.get("/user/:user_id", getReviewsByUser)
router.get("/watch/:watch_id", getReviewsByWatch);
router.patch("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;