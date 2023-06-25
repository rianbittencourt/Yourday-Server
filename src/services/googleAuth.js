const { OAuth2Client } = require("google-auth-library");
const dotenv = require("dotenv");
dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

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
    const googleID = idToken;

    return { idToken, googleID }; // Retorna um objeto com idToken e googleID
  } catch (error) {
    console.error("Erro ao obter o idToken do Google:", error);
    throw new Error("Ocorreu um erro ao obter o idToken do Google.");
  }
};

module.exports = { getGoogleIdToken };