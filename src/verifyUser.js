const { OAuth2Client } = require("google-auth-library");
const express = require("express");
const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
app.use(express.json());

const getClient = async () => {
  // Crie um OAuth2Client com o ID do cliente e a chave secreta do cliente do Google
  const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);

  return client;
};

const getGoogleIdToken = async (accessToken) => {
  const client = await getClient();

  try {
    const ticket = await client.verifyIdToken({
      idToken: accessToken,
      audience: CLIENT_ID, // O ID do cliente do Google
    });

    const payload = ticket.getPayload();
    const idToken = payload.sub;

    return idToken;
  } catch (error) {
    console.error("Erro ao obter o idToken do Google:", error);
    throw new Error("Ocorreu um erro ao obter o idToken do Google.");
  }
};
async function verifyUser(req, res, googleID) {
  try {
    // Verificar se o googleID já está presente no banco de dados
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE googleID = $1",
      [googleID]
    );

    if (existingUser.rows.length > 0) {
      // Usuário já existe, retornar tabela inteira do usuário
      return res.status(200).json({ user: existingUser.rows[0] });
    } else {
      // Retornar array vazio, já que o usuário não existia anteriormente
      return res.status(200).json({ user: [] });
    }
  } catch (error) {
    console.error("Erro ao verificar e adicionar usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

// Rota para verificar o usuário com base no accessToken
app.post("/users", async (req, res) => {
  const { accessToken } = req.body;

  try {
    const idToken = await getGoogleIdToken(accessToken);
    const googleID = idToken;
    await verifyUser(req, res, googleID); // Passar o googleID como argumento para verifyUser
  } catch (error) {
    console.error("Erro ao verificar usuário:", error);
    res.status(500).json({ error: "Ocorreu um erro ao verificar o usuário." });
  }
});

app.listen(3000, () => {
  console.log("Servidor iniciado na porta 3000");
});
0;
