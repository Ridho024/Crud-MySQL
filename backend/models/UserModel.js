import db from "../config/Database.js";
import { Sequelize } from "sequelize";

const { DataTypes } = Sequelize;

const User = db.define(
  "users",
  {
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "default_image.png",
    },
    url: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

export default User;

(async () => {
  await db.sync({ alter: true });
})();
