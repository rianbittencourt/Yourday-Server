const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

async function verifyUser(req, res, googleID) {
  try {
    // Verificar se o googleID já está presente no banco de dados
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE googleID = $1",
      [googleID]
    );

    if (existingUser.rows.length > 0) {
      // Usuário já existe, retornar tabela inteira do usuário
      return res.status(200).json({ message:"Usuário existente", user: existingUser.rows[0] });
    } else {
      // Se não existe, retorna um array vazio
      return res.status(200).json({message:"Usuário não existe", user: [] });
    }
  } catch (error) {
    console.error("Erro ao verificar e adicionar usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

module.exports = { verifyUser };