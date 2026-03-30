const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const { config, isAllowedSender } = require("./config");
const { handleCommand } = require("./commands");

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: config.clientId,
  }),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("qr", (qr) => {
  console.log("Escaneie o QR Code abaixo no WhatsApp:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Bot conectado ao WhatsApp e pronto para uso.");
});

client.on("authenticated", () => {
  console.log("Autenticado com sucesso.");
});

client.on("auth_failure", (message) => {
  console.error("Falha na autenticacao:", message);
});

client.on("disconnected", (reason) => {
  console.warn("Desconectado do WhatsApp:", reason);
});

client.on("message", async (message) => {
  try {
    if (message.fromMe) {
      return;
    }

    const isGroup = String(message.from || "").endsWith("@g.us");
    if (isGroup && !config.allowGroups) {
      return;
    }

    if (!isAllowedSender(message.from)) {
      return;
    }

    const response = await handleCommand(message.body);
    if (!response) {
      return;
    }

    await message.reply(response);
  } catch (error) {
    console.error("Erro ao processar mensagem:", error);
    await message.reply("Erro interno no bot. Tente novamente em alguns instantes.");
  }
});

client.initialize().catch((error) => {
  console.error("Nao foi possivel iniciar o cliente do WhatsApp:", error);
  process.exit(1);
});
