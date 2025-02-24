import Note from "../model/NoteModel.js";

export const getNote = async(req, res) => {
    try {
        const response = await Note.findAll();
        res.status(200).json(response)
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg:"Failed to get data"});
    }
}

export const createNote = async(req, res) => {
    try {
        await Note.create(req.body);
        res.status(201).json({msg: "Note created"});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg: "Failed to create note"});
    }
}

export const updateNote = async(req, res) => {
    try {
        const note = await Note.findByPk(req.params.id);
        if (!note) {
            return res.status(404).json({msg: "Cannot find note"});
        }

        await Note.update(req.body, {
            where: {id: req.params.id}
        });

        res.status(200).json({msg:"Successfully update note"});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg:"Failed to update note"});
    }
}

export const deleteNote = async(req, res) => {
    try {
        const note = await Note.findByPk(req.params.id);
        if (!note) {
            return res.status(404).json({msg: "Cannot find note"});
        }

        await Note.destroy({
            where: {id: req.params.id}
        });

        res.status(200).json({msg:"Successfully delete note"});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg:"Failed to delete note"});
    }
}