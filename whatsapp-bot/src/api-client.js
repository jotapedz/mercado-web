const axios = require("axios");
const { config } = require("./config");

const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

function extractApiError(error) {
  if (!error) {
    return "Erro desconhecido.";
  }

  const status = error.response?.status;
  const payload = error.response?.data;

  if (typeof payload === "string" && payload.trim()) {
    return status ? `[${status}] ${payload}` : payload;
  }

  if (payload && typeof payload === "object") {
    const details = payload.title || payload.message || JSON.stringify(payload);
    return status ? `[${status}] ${details}` : details;
  }

  if (error.code === "ECONNABORTED") {
    return "Tempo de resposta da API esgotado.";
  }

  if (error.code === "ECONNREFUSED") {
    return "Nao foi possivel conectar na API. Verifique se ela esta rodando.";
  }

  return error.message || "Erro desconhecido.";
}

async function get(path) {
  try {
    const response = await api.get(path);
    return response.data;
  } catch (error) {
    throw new Error(extractApiError(error));
  }
}

async function post(path, body) {
  try {
    const response = await api.post(path, body);
    return response.data;
  } catch (error) {
    throw new Error(extractApiError(error));
  }
}

async function patch(path, body) {
  try {
    const response = await api.patch(path, body);
    return response.data;
  } catch (error) {
    throw new Error(extractApiError(error));
  }
}

module.exports = {
  get,
  post,
  patch,
};
