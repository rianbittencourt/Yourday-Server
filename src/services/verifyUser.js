const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();
const { getUser } = require("../repository/userReposityory");
const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

async function verifyUser(req, res, googleID) {
  try {
    // Verificar se o usuário já existe
    const userExists = await getUser(googleID);

    if (userExists) {
      // Usuário já existe, retornar tabela do usuário
      return res
        .status(400)
        .json({ error: "Usuário já existe", user: userExists });
    } else {
      return res.status(200).json({ message: "Usuário não Existe", user: [] });
    }
  } catch (error) {
    console.error("Erro ao verificar e adicionar usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

module.exports = { verifyUser };
