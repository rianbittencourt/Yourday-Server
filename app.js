const express = require("express");
const getUserRouter = require("./src/routes/getUser");
const createUserRouter = require("./src/routes/createUser")

const app = express();

app.use(express.json());

app.use("/users", getUserRouter);
app.use("/create", createUserRouter)

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
