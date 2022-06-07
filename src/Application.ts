import express, { Router } from "express";
import Database from "./configs/Database";
import { Server } from "http";
import FileUpload from "express-fileupload";
import cors from "cors";
import seeder from "./seeders";

export default class Application {
  public app: express.Application;

  constructor(routes: Router) {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    (async () => await this.initializeDatabase())();
  }

  private initializeMiddlewares(): Express.Application {
    return this.app.use([
      express.json(),
      express.urlencoded({ extended: false }),
      FileUpload(),
      cors(),
      express.static("public"),
    ]);
  }

  private initializeRoutes(routes: Router): Express.Application {
    return this.app.use(routes);
  }

  private initializeDatabase = async (): Promise<void> => {
    try {
      await Database.authenticate();
      await Database.sync({ force: true });
      await seeder();
    } catch (e) {
      console.log(`Ada error nih di bagian database! ${e}`);
    }
  };

  public listen(port: string | number, callback?: () => void): Server {
    return this.app.listen(port, callback);
  }
}
