import express from "express"

import {
    createUser, 
    getUsers,
    getUserByID,
    updateUser, 
    deleteUser

} from "../controllers/userController.js"


const router = express.Router();
router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserByID);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;