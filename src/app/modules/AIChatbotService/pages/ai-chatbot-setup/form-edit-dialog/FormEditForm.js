import React, { useEffect, useState, useRef, useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { ChevronRight, MoveUp, Plus } from "lucide-react";
import { formatDate } from "../../../../../utils/common";
import { useFormUIContext } from "../FormUIContext";
import { useDispatch } from "react-redux";
import { newQuestionClick } from "../../../_redux/redux-Actions";

const schema = Yup.object().shape({
  question: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
});

export function FormEditForm({
  saveForm,
  currentChat,
  actionsLoading,
  value,
  chatList,
  id,
}) {
  const [question, setQuestion] = useState(value);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const handleSend = () => {
    if (!question.trim() || actionsLoading) return;
    // Call your send function here
    saveForm({
      question,
      sessionId: currentChat?.length ? currentChat[0]?.sessionId : null,
    });
    setQuestion("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [question]);

  useEffect(() => {
    if (!messagesEndRef.current) return;

    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [currentChat]);

  return (
    <div className="grid grid-cols-12 min-h-[80dvh] gap-x-2 overflow-hidden">
      <ChatListComp chatData={chatList} id={id} />
      <div className="col-span-12 md:col-span-9 lg:col-span-10 flex flex-col bg-white min-w-0">
        {/* Header */}
        <div className="flex-shrink-0 text-gray-800 text-xl font-semibold py-4 border-b border-gray-200 px-4">
          <span>AI HR Assistant</span>
        </div>
        <hr />

        {/* Messages Container - Scrollable area */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto py-4 px-4 scrollbar-fancy"
        >
          <div className="h-[58dvh] md:max-h-[58dvh] border-b-2 border-b-black overflow-auto scrollbar-fancy scroll-smooth">
            {currentChat.map((msg, index) => (
              <div key={index} className="mb-3 flex flex-col gap-2">
                {/* QUESTION (right side - 40%) */}
                {msg.question && (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] sm:max-w-[70%] md:max-w-[50%] lg:max-w-[40%] text-sm bg-tprimary text-white p-2 rounded-xl rounded-br-none leading-6 whitespace-pre-wrap break-words">
                      {msg.question}
                    </div>
                  </div>
                )}

                {msg.content && (
                  <div className="flex justify-start">
                    <div
                      className={`
         p-2 w-fit min-w-[80%] max-w-[95%] sm:max-w-[90%] md:max-w-[82%]  rounded-xl text-sm rounded-bl-none  leading-6
        ${msg.isError ? "bg-red-400 text-white" : "bg-tsecondary text-black"}
      `}
                    >
                      {msg.isError ? (
                        <div className="text-left whitespace-pre-wrap">
                          {msg.content}
                        </div>
                      ) : (
                        <div
                          className="assistant-html text-left overflow-x-auto break-words"
                          dangerouslySetInnerHTML={{
                            __html: msg.content || "",
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-3">
          <div className="w-full">
            <Formik
              enableReinitialize={true}
              initialValues={{ question: value || "" }}
              validationSchema={schema}
              onSubmit={(values) => {
                if (!question.trim() || actionsLoading) return;
                handleSend();
              }}
            >
              {({ handleSubmit, errors, touched, values, setFieldValue }) => (
                <Form className="form form-label-right">
                  <fieldset disabled={actionsLoading}>
                    <div className="relative max-w-[900px] mx-auto">
                      <textarea
                        ref={textareaRef}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Message AI HR Assistant..."
                        rows={1}
                        disabled={actionsLoading}
                        className={`
                          form-control w-full resize-none border border-gray-200 rounded-2xl 
                          bg-transparent p-3 pr-14 text-gray-800 text-[15px] leading-6 
                          max-h-[120px] min-h-[44px] focus:outline-none focus:ring-1 
                          focus:ring-tprimary focus:border-tprimary
                          placeholder:text-gray-400
                          ${
                            actionsLoading
                              ? "opacity-60 cursor-not-allowed"
                              : "opacity-100 cursor-text"
                          }
                            `}
                      />
                      <button
                        type="submit"
                        onClick={handleSend}
                        disabled={actionsLoading || !question.trim()}
                        className={`
                              absolute bottom-2 right-2 w-8 h-8 rounded-full bg-tprimary text-white 
                              border-none outline-none flex items-center justify-center transition-all 
                              ${
                                actionsLoading || !question.trim()
                                  ? "opacity-50 cursor-not-allowed"
                                  : "opacity-100 cursor-pointer hover:scale-105 hover:bg-tprimary/90"
                              }
                            `}
                        title={
                          actionsLoading
                            ? "Waiting for response..."
                            : "Send message"
                        }
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-center text-gray-400 text-xs mt-2">
                      AI may make mistakes. Verify important information.
                    </div>
                  </fieldset>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-bounce {
          animation: bounce 1.4s infinite ease-in-out both;
        }

        /* HTML content styling for assistant messages */
        .assistant-html table {
          width: 100%;
          border-collapse: collapse;
          margin: 8px 0;
        }

        .assistant-html table th,
        .assistant-html table td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .assistant-html table th {
          background: #f3f4f6;
          font-weight: 600;
        }

        .assistant-html h1,
        .assistant-html h2,
        .assistant-html h3 {
          margin: 12px 0 8px 0;
          color: #2563eb;
        }

        .assistant-html p {
          margin: 6px 0;
        }

        .assistant-html canvas {
          max-width: 100%;
          height: auto;
        }

        .assistant-html ul,
        .assistant-html ol {
          margin: 6px 0;
          padding-left: 20px;
        }

        .assistant-html code {
          background: #f3f4f6;
          padding: 2px 4px;
          border-radius: 4px;
          font-size: 0.9em;
          color: #dc2626;
        }

        .assistant-html pre {
          background: #f3f4f6;
          padding: 8px;
          border-radius: 6px;
          overflow-x: auto;
        }

        .assistant-html pre code {
          background: transparent;
          padding: 0;
          color: inherit;
        }

        .assistant-html blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 16px;
          margin: 8px 0;
          color: #6b7280;
        }

        .assistant-html a {
          color: #2563eb;
          text-decoration: underline;
        }

        .assistant-html img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

const ChatListComp = ({ chatData = [], id }) => {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();

  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      existingButtonClick: FormUIContext.existingButtonClick,
    };
  }, [FormUIContext]);

  const handleNewChat = () => {
    // Handle new chat creation
    FormUIProps.newFormButtonClick();
    dispatch(newQuestionClick());
  };

  const handleChatSelect = (sessionId) => {
    FormUIProps.existingButtonClick(sessionId);
  };

  return (
    <div className="col-span-12 md:col-span-3 lg:col-span-2 bg-white border-r border-gray-200 flex flex-col h-full md:max-h-none max-h-[220px] overflow-hidden">
      {/* New Chat Button */}
      <div className="pt-4 px-4 border-b border-gray-200">
        <button
          onClick={handleNewChat}
          className="w-full bg-tprimary border-none hover:text-black text-white font-medium py-2 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5 text-white" />
          New Chat
        </button>
      </div>
      <hr />
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto max-h-[180px] md:max-h-[58dvh]">
        {chatData.length === 0 ? (
          <div className="text-center text-black py-6">No chats available</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {chatData.map((chat) => (
              <div
                key={chat.sessionId}
                title={chat.question}
                onClick={() => handleChatSelect(chat.sessionId)}
                className={`  m-1 py-2  px-1 rounded-lg cursor-pointer  ${
                  id == chat?.sessionId
                    ? "bg-tprimary  hover:text-black hover:bg-tsecondary hover:border hover:border-black"
                    : "bg-tsecondary  hover:bg-white hover:border hover:border-black"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm  line-clamp-1">{chat.question}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs ">
                        {formatDate(new Date(chat.createdAt), "dd-MMM-yyyy")}
                      </span>
                      <span className="text-xs ">
                        • {chat.totalMessages}{" "}
                        {chat.totalMessages === 1 ? "message" : "messages"}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 " />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
