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

module.exports = { getUser };