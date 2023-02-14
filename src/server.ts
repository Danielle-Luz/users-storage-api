import { connection } from "./database/database.config";
import { app } from "./app";

app.listen(3000, async () => {
  console.log("The API is running :))");

  await connection.connect();
});
