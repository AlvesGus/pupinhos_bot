-- CreateTable
CREATE TABLE "Transacao" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "local" TEXT NOT NULL,
    "tipoCategoria" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "telegram_id" INTEGER NOT NULL,
    "nome_usuario" TEXT NOT NULL,
    "registrado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transacao_pkey" PRIMARY KEY ("id")
);
