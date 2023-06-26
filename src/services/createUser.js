const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

const { getUser } = require("../repository/userReposityory");

async function createUser(
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
      const newUserQuery = {
        text: "INSERT INTO users (firstName, lastName, gender, nationality, googleID, isPremium, birthday, createdAt, amountPost, amountReading) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        values: [
          firstName,
          lastName,
          gender,
          nationality,
          googleID,
          false,
          birthday,
          new Date(),
          0,
          0,
        ],
      };

      const newUserResult = await pool.query(newUserQuery);
      const newUser = newUserResult.rows[0];

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

module.exports = { createUser };
