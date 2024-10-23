import express from "express";
import { getUsers, getUserByID, createUser, editUser, deleteUser } from "../controllers/UserController.js";

const router = express.Router();
router.get("/users", getUsers);
router.get("/user/data/:id", getUserByID);
router.post("/users", createUser);
router.patch("/user/edit/:id", editUser);
router.delete("/user/:id", deleteUser);

export default router;
