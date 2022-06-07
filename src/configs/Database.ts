import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import Role from "../models/Role.model";
import Hero from "../models/Hero.model";

const DatabaseConfig: SequelizeOptions = {
  database: "mobile_legend",
  username: "root",
  dialect: "mysql",
  password: "",
};

const Database = new Sequelize(DatabaseConfig);

Database.addModels([Role, Hero]);

export default Database;
