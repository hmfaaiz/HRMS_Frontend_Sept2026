import * as requestFromServer from "./redux-Crud";
import { AIChatbotSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = AIChatbotSlice;

export const askQuestion = (payload) => async (dispatch, getState) => {
  const assistantMessageId = Date.now() + 1;

  dispatch(
    actions.AskQuestionStarted({
      question: payload.question,
      isStreaming: true,
      content: "",
      assistantMessageId,
    }),
  );

  try {
    const {
      auth: { tokens },
    } = getState();

    const response = await fetch(
      `${requestFromServer.USERS_URL}/ai_chatbot/ask-question`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(tokens?.access && {
            Authorization: `Bearer ${tokens.access}`,
          }),
        },
        body: JSON.stringify(payload),
      },
    );

    //  same error handling pattern
    if (response.status === 308) {
      window.location.href = "/logout";
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;

        const chunk = JSON.parse(line);

        if (chunk.type === "step") {
          dispatch(
            actions.AskQuestionProcessReceived({
              question: payload.question,
              assistantMessageId,
              isStreaming: true,
              content: chunk.data,
            }),
          );
        }
        if (chunk.type === "chunk") {
          dispatch(
            actions.AskQuestionChunkReceived({
              question: payload.question,
              assistantMessageId,
              isStreaming: true,
              content: chunk.data,
            }),
          );
        }

        if (chunk.type === "complete" || chunk.type === "done") {
          if (chunk.data?.success === false || chunk.data?.error) {
            dispatch(
              actions.AskQuestionFailed({
                ...payload,
                assistantMessageId,
                question: payload.question,
                isStreaming: false,
                message:
                  chunk.data?.answer ||
                  chunk.data?.error ||
                  chunk.message ||
                  "Something went wrong",
                data: chunk.data,
              }),
            );

            toast.error(
              chunk.data?.answer ||
                chunk.data?.error ||
                chunk.message ||
                "Something went wrong",
            );

            return;
          }

          dispatch(
            actions.AskQuestionCompleted({
              ...payload,
              assistantMessageId,
              data: chunk.data,
              content: chunk?.answer,
              isStreaming: false,

            }),
          );
        }
      }
    }
  } catch (error) {
    dispatch(
      actions.AskQuestionFailed({
        ...payload,
        assistantMessageId,
        question: payload.question,
        isStreaming: false,
        message: error.message,
      }),
    );

    toast.error(error.message || "Something went wrong");
  }
};
export const fetchCurrentChatById = (payload) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getChatHistoryById(payload)
    .then((response) => {
      dispatch(actions.ChatHistoryFetched(response?.data?.data));
    })
    .catch((error) => {
      error.clientMessage = error?.response?.data?.message || "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error?.response?.data?.message || "Something went wrong");
    });
};

export const fetchChatList = () => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getChatHistory()
    .then((response) => {
      console.log("response ", response?.data?.data);
      dispatch(actions.ChatListFetched(response?.data?.data));
    })
    .catch((error) => {
      error.clientMessage = error?.response?.data?.message || "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
      toast.error(error?.response?.data?.message || "Something went wrong");
    });
};

export const newQuestionClick = () => async (dispatch) => {
  dispatch(actions.newQuestion());
};
