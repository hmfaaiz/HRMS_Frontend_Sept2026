import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export function askQuestion(body) {
  return axios.post(`${USERS_URL}/ai_chatbot/ask-question`, body);
}

export function getChatHistoryById(body) {
  return axios.post(`${USERS_URL}/ai_chatbot/read-chat-history-by-Id`, body);
}

export function getChatHistory() {
  return axios.get(`${USERS_URL}/ai_chatbot/read-all-chat-history`);
}

export function deleteChat(payload) {
  return axios.post(`${USERS_URL}/ai_chatbot/delete-chat-history`, payload);
}

export function downloadMessageAsPdf(payload) {
  const config = {
    responseType: "arraybuffer",
  };
  return axios.post(
    `${USERS_URL}/ai_chatbot/download-chat-pdf`,
    payload,
    config,
  );
}
