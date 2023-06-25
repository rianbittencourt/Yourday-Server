const express = require("express");
const router = express.Router();
const { getGoogleIdToken } = require("../services/googleAuth");
const { verifyUser } = require("../services/verifyUser");

router.get("/", async (req, res) => {
  const { accessToken } = req.body;

  try {
    const { googleID } = await getGoogleIdToken(accessToken);
    await verifyUser(req, res, googleID);
  } catch (error) {
    console.error("Erro ao verificar usuário:", error);
    res.status(500).json({ error: "Token de Acesso inválido ou expirado" });
  }
});

module.exports = router;
