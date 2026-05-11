import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function FormEditDialog({ id, value }) {
  const dispatch = useDispatch();

  const { actionsLoading, currentChat, chatList } = useSelector((state) => {
    return {
      actionsLoading: state.ai_chatbot.actionsLoading,
      currentChat: state.ai_chatbot.currentChat,
      chatList: state.ai_chatbot.chatList,
    };
  }, shallowEqual);
  useEffect(() => {
    if (!id) return;
    dispatch(actions.fetchCurrentChatById({ sessionId: id }));
  }, [id, dispatch]);

  const saveForm = async (data) => {
    dispatch(actions.askQuestion(data));
  };

  return (
    <>
      <FormEditForm
        saveForm={saveForm}
        currentChat={currentChat}
        value={value || ""}
        chatList={chatList}
        id={id}
        actionsLoading={actionsLoading}
      />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
