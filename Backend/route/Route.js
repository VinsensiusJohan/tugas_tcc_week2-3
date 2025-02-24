import express from "express";
import { createNote, getNote, updateNote, deleteNote } from "../controller/NoteController.js";

const router = express.Router();

router.get('/note', getNote);
router.post('/add', createNote);
router.put('/note-update/:id', updateNote);
router.delete('/note-delete/:id', deleteNote);

export default router;