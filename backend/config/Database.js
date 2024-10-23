import { Sequelize } from "sequelize";

const db = new Sequelize("crud_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// try {
//   await sequelize.authenticate();
//   console.log('Connection has been established successfully.');
//   await
// } catch (error) {
//   console.error('Unable to connect to the database:', error);
// }

export default db;
