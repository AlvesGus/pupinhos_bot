require("dotenv").config();
const express = require("express");
const transacoesRoutes = require("./routes/transacoes");

const app = express();
app.use(express.json());
app.use("/api", transacoesRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
