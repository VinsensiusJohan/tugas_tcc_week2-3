import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createNote, getNote, updateNote, deleteNote } from "../controller/NoteController.js";
import {
    registerUser,
    loginUser,
    logoutUser
} from "../controller/UserController.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/logout", logoutUser);

router.get('/note', verifyToken, getNote);
router.post('/add', verifyToken, createNote);
router.put('/note-update/:id', verifyToken, updateNote);
router.delete('/note-delete/:id', verifyToken, deleteNote);

export default router;