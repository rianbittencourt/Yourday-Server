const express = require("express");
const router = express.Router();
const { getGoogleIdToken } = require("../services/googleAuth");
const { createUser } = require("../services/createUser");

router.get("/", async (req, res) => {
  const { firstName, lastName, gender, birthday, accessToken } = req.body;

  try {
    const { googleID } = await getGoogleIdToken(accessToken);
    await createUser(req, res, googleID, firstName, lastName, gender, birthday);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Token de Acesso inválido ou expirado" });
  }
});

module.exports = router;
