const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");

const databasePath = path.join(__dirname, "userData.db");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3092, () =>
      console.log("Server Running at http://localhost:3092/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.post("/register", async (request, response) => {
  const { name, email } = request.body;
  const createUserQuery = `
  INSERT INTO
   user (name, email)
  VALUES
   (
    '${name}',
    '${email}'
   );`;
  database.run(createUserQuery);

  response.send("User created successfully");
});
app.get("/getdata", async (request, response) => {
  const { name, email } = request.body;
  const GetData = `
 SELECT * FROM user`;
  let getRequest = await database.all(GetData);

  response.send(getRequest);
});
app.delete("/delete", async (request, response) => {
  const deleteData = `
  DELETE FROM user`;
  let getRequest = await database.all(deleteData);

  response.send("Delete Data Successfully");
});
module.exports = app;
