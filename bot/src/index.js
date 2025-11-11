require("dotenv").config();
const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const fs = require("fs");
const path = require("path");
const { interactWithGemini } = require("./gemini/");

// Evita rodar múltiplas instâncias do bot
if (process.env.BOT_RUNNING) {
  console.log("⚠️ Bot já está rodando — encerrando duplicata");
  process.exit(0);
}
process.env.BOT_RUNNING = true;

const bot = new Telegraf(process.env.TELEGRAM_TOKKEN);
const filePath = path.join(__dirname, "transacoes.json");

// Evita processar a mesma mensagem 2x
const usuariosEmProcessamento = new Map();
let ultimoUpdateId = null;

function salvarTransacao(dados, user) {
  try {
    let transacoes = [];
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath);
      transacoes = JSON.parse(raw);
    }

    const novaTransacao = {
      tipo: dados.tMovimentacao,
      valor: dados.valorMovimentacao,
      categoria: dados.tipo,
      local: dados.local,
      data: dados.data,
      telegram_id: user.id,
      nome_usuario: user.first_name,
      registrado_em: new Date().toLocaleString("pt-BR"),
    };

    transacoes.push(novaTransacao);
    fs.writeFileSync(filePath, JSON.stringify(transacoes, null, 2));

    console.log("💾 Transação salva:", novaTransacao);
    return [true, "Transação registrada e salva localmente"];
  } catch (error) {
    console.error("❌ Erro ao salvar:", error);
    return [false, "Erro ao salvar no arquivo local"];
  }
}

bot.start(async (ctx) => {
  await ctx.reply(`Bem-vindo, ${ctx.from.first_name}! 👋`);
  await ctx.reply("Envie sua nova transação para que eu cadastre.");
  await ctx.reply("Exemplo: *Gastei 150 reais no mercado hoje.*", {
    parse_mode: "Markdown",
  });
});

bot.on(message("text"), async (ctx) => {
  const userId = ctx.from.id;
  const text = ctx.message.text.trim();

  // Evita duplicação por update repetido
  if (ctx.update.update_id === ultimoUpdateId) {
    console.log("⚠️ Ignorando mensagem duplicada:", text);
    return;
  }
  ultimoUpdateId = ctx.update.update_id;

  // Evita que o mesmo usuário envie várias mensagens simultâneas
  if (usuariosEmProcessamento.get(userId)) {
    await ctx.reply(
      "⏳ Aguarde, ainda estou processando sua última transação..."
    );
    return;
  }

  usuariosEmProcessamento.set(userId, true);
  await ctx.reply("💭 Entendendo sua mensagem...");

  try {
    const dados = await interactWithGemini(text);

    if (
      !dados ||
      !dados.tMovimentacao ||
      !dados.valorMovimentacao ||
      !dados.local ||
      !dados.data
    ) {
      await ctx.reply(
        "❌ Não consegui entender sua mensagem. Tente algo como: *Gastei 80 reais no posto hoje.*",
        { parse_mode: "Markdown" }
      );
      usuariosEmProcessamento.delete(userId);
      return;
    }
  } catch (error) {
    console.error("Erro ao processar mensagem:", error);
    await ctx.reply("⚠️ Ocorreu um erro ao interpretar sua transação.");
  } finally {
    usuariosEmProcessamento.delete(userId);
  }
});

bot.launch();
console.log("🤖 Bot is running...");
