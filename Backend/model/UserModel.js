import { Sequelize } from "sequelize";
import db from "../config/Database.js"

const User = db.define(
    'user',
    {
        name: Sequelize.STRING,
        password: Sequelize.STRING,
    }
);

export default User;

(async() => {
    await db.sync();
}) ();
