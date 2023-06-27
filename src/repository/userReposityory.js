const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

async function getUser(googleID) {
  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE googleID = $1",
      [googleID]
    );

    if (existingUser.rows.length > 0) {
      // Usuário já existe, retornar a tabela completa do usuário
      return existingUser.rows[0];
    } else {
      // Se não existe, retorna null
      return null;
    }
  } catch (error) {
    console.error("Erro ao verificar usuário:", error);
    throw error;
  }
}

async function createUser(
  firstName,
  lastName,
  gender,
  nationality,
  googleID,
  birthday
) {


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

  try {
    const newUserResult = await pool.query(
      newUserQuery.text,
      newUserQuery.values
    );
    const newUser = newUserResult.rows[0];
    return newUser;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
}
module.exports = { getUser, createUser };
