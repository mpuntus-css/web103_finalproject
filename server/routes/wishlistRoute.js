import express from "express"

import {
    createWishlistItem,
    getWishlist,
    getWishlistByUser,
    updateWishlistItem,
    deleteWishlistItem,
    deleteWishlistByUser


} from "../controllers/wishlistController.js"

const router = express.Router();

router.post("/", createWishlistItem);
router.get("/", getWishlist);
router.get("/user/:user_id", getWishlistByUser);
router.patch("/:id", updateWishlistItem);
router.delete("/:id", deleteWishlistItem);
router.delete("/user/:user_id", deleteWishlistByUser);

export default router;