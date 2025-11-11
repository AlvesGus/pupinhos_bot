/*
  Warnings:

  - You are about to drop the `Transacao` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Transacao";

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "local" TEXT NOT NULL,
    "tipoCategoria" TEXT,
    "data" TEXT NOT NULL,
    "telegram_id" INTEGER NOT NULL,
    "nome_usuario" TEXT NOT NULL,
    "registrado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
