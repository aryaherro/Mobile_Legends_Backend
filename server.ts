import Application from "./src/Application";
import Routes from "./src/routes";

const app = new Application(Routes);

app.listen(9000);
