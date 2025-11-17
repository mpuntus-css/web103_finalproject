import express from "express"


import  {
    getWatches,
    getWatchByID



} from '../controllers/watchController.js'

const router = express.Router();

router.get("/", getWatches);
router.get("/:id", getWatchByID);


export default router;