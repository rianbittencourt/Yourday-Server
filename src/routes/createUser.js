const express = require("express");
const router = express.Router();
const { getGoogleIdToken } = require("../services/googleAuth");
const { createNewUser } = require("../services/createUser");

router.post("/", async (req, res) => {

  
  const { firstName, lastName, gender, birthday, accessToken, nationality } =
    req.body;

  try {
    if (!firstName || !lastName || !gender || !nationality || !birthday) {
      return res
        .status(400)
        .json({
          status: "Failed",
          message: "Campos obrigatórios não preenchidos",
        });
    }

    const { googleID } = await getGoogleIdToken(accessToken);
    await createNewUser(
      req,
      res,
      googleID,
      firstName,
      lastName,
      gender,
      birthday,
      nationality
    );
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Token de Acesso inválido ou expirado" });
  }
});

module.exports = router;
