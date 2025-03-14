import { Sequelize } from "sequelize";

const db = new Sequelize('note', 'root', '12345', {
    host: '34.173.12.206',
    dialect: 'mysql'
}); 

export default db;