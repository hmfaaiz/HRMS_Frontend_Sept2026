import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";

export function FormEditDialog({ id, value }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const { actionsLoading, currentChat, chatList, user } = useSelector(
    (state) => {
      return {
        actionsLoading: state.ai_chatbot.actionsLoading,
        currentChat: state.ai_chatbot.currentChat,
        chatList: state.ai_chatbot.chatList,
        user: state?.auth?.user,
      };
    },
    shallowEqual,
  );

  useEffect(() => {
    if (!id) return;
    dispatch(actions.fetchCurrentChatById({ sessionId: id }));
  }, [id, dispatch]);

  useEffect(() => {
    if (!user) return;

    if (!user?.allowAIChatbot) {
      history.push("/dashboard");
    }
  }, [user]);

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
