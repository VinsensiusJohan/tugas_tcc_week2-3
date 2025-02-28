import { Sequelize } from "sequelize";
import db from "../config/Database.js"

const Note = db.define('note', {
    title: Sequelize.STRING,
    content: Sequelize.TEXT,
    },{
        freezeTableName: true,
        createdAt: 'tanggal_buat',
        updatedAt: 'tanggal_ubah'
});

export default Note;

(async() => {
    await db.sync();
})();