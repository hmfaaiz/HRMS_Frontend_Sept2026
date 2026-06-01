import { createSlice } from "@reduxjs/toolkit";

const initVal = {
  listLoading: false,
  actionsLoading: null,
  currentChat: [],
  chatList: [],
  error: null,
};

export const callTypes = {
  list: "list",
  action: "action",
};

export const AIChatbotSlice = createSlice({
  name: "ai_chatbot",
  initialState: initVal,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },

    AskQuestionStarted: (state, action) => {
      const { question, assistantMessageId } = action.payload;

      state.currentChat.push({
        id: assistantMessageId,
        question,
        content: "",
        processText: "",
        isStreaming: true,
        isError: false,
        meta: {},
      });
    },
    AskQuestionProcessReceived: (state, action) => {
      const { assistantMessageId, content } = action.payload;

      const msg = state.currentChat.find((x) => x.id === assistantMessageId);

      if (msg) {
        msg.processText = content || "";
      }
    },
    AskQuestionChunkReceived: (state, action) => {
      const { assistantMessageId, content } = action.payload;

      const msg = state.currentChat.find((x) => x.id === assistantMessageId);

      if (msg) {
        msg.processText = "";
        msg.content += content || "";
      }
    },

    AskQuestionCompleted: (state, action) => {
      const { assistantMessageId, data } = action.payload;

      const msg = state.currentChat.find((x) => x.id === assistantMessageId);

      if (msg) {
        msg.processText = "";
        msg.content = data?.answer || msg.content;
        msg.isStreaming = false;
        msg.isError = data?.success === false || !!data?.error;
      }

      state.actionsLoading = false;
    },
    AskQuestionFailed: (state, action) => {
      const { assistantMessageId, message, data } = action.payload;

      const msg = state.currentChat.find((x) => x.id === assistantMessageId);

      if (msg) {
        msg.content = message || "Something went wrong";
        msg.isStreaming = false;
        msg.isError = true;
        msg.meta = data || {};
      }

      state.actionsLoading = false;
      state.error = message || "Something went wrong";
    },
    newQuestion: (state, action) => {
      state.listLoading = false;
      state.actionsLoading = false;
      state.currentChat = [];
      state.error = null;
    },
    ChatHistoryFetched: (state, action) => {
      state.currentChat = action.payload;
      state.actionsLoading = false;
      state.error = null;
    },
    ChatListFetched: (state, action) => {
      state.chatList = action.payload;
      state.listLoading = false;
      state.error = null;
    },
  },
});
