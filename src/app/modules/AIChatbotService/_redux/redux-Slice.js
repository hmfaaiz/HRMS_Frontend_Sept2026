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
        isStreaming: true,
        isError: false,
        meta: {},
      });

      state.actionsLoading = true;
      state.error = null;
    },
    AskQuestionProcessReceived: (state, action) => {
      const { assistantMessageId, content } = action.payload;

      const msg = state.currentChat.find((x) => x.id === assistantMessageId);

      if (msg) {
        // Add newline before each chunk except the first one
        if (msg.content && msg.content.length > 0) {
          msg.content += "\n" + (content || "");
        } else {
          msg.content = content || "";
        }
      }
    },
    AskQuestionChunkReceived: (state, action) => {
      const { assistantMessageId, content } = action.payload;

      const msg = state.currentChat.find((x) => x.id === assistantMessageId);

      if (msg) {
        msg.content += content || "";
      }
    },

    AskQuestionCompleted: (state, action) => {
      const { assistantMessageId, data, content } = action.payload;

      const index = state.currentChat.findIndex(
        (x) => x.id === assistantMessageId,
      );

      if (index !== -1) {
        state.currentChat[index] = {
          ...state.currentChat[index], // initial question/id safe rahen
          ...data, // backend payload merge
          content: data?.answer,
          isStreaming: false,
          isError: data?.success === false || !!data?.error,
        };
      }

      state.actionsLoading = false;
      state.error = data?.success === false ? data?.error : null;
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
