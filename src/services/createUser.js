const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

const { getUser, createUser } = require("../repository/userReposityory");

async function createNewUser(
  req,
  res,
  googleID,
  firstName,
  lastName,
  gender,
  nationality,
  birthday
) {
  try {
    // Verificar se o usuário já existe
    const userExists = await getUser(googleID);

    if (userExists) {
      // Usuário já existe, retornar tabela do usuário
      return res
        .status(400)
        .json({ error: "Usuário já existe", user: userExists });
    } else {
      // Inserir novo usuário no banco de dados

      const newUser = await createUser(
        firstName,
        lastName,
        gender,
        nationality,
        googleID,
        birthday
      );

      // Retornar mensagem de sucesso com as informações do novo usuário
      return res
        .status(200)
        .json({ message: "Usuário criado com sucesso", user: newUser });
    }
  } catch (error) {
    console.error("Erro ao verificar e adicionar usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

module.exports = { createNewUser };
