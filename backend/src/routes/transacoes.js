const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).send('API is healthy');
})

// GET — listar transações
router.get("/transactions", async (req, res) => {
  try {
    const data = await prisma.transaction.findMany({
      orderBy: { registrado_em: "desc" },
    });
    res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao listar:", error);
    res.status(500).json({ error: "Erro ao listar transações" });
  }
});

// POST — adicionar transação
router.post("/add-transactions", async (req, res) => {
  try {
    const { tipo, valor, local, data, telegram_id, nome_usuario } = req.body;

    if (!tipo || !valor || !local || !data) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        tipo,
        valor: parseFloat(valor),
        local,
        data,
        telegram_id,
        nome_usuario,
      },
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Erro ao adicionar:", error);
    res.status(500).json({ error: "Erro ao adicionar transação" });
  }
});

router.delete("/delete-transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTransaction = await prisma.transaction.delete({
      where: { id }, // já é string
    });

    return res.status(200).json({ message: "Transação deletada com sucesso", deletedTransaction });

  } catch (error) {
    console.error("Erro ao deletar:", error);
    return res.status(500).json({ error: "Erro ao deletar transação" });
  }
});

module.exports = router;
