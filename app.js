const express = require("express");
const getUserRouter = require("./src/routes/getUser");

const app = express();

app.use(express.json());

app.use("/users", getUserRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
