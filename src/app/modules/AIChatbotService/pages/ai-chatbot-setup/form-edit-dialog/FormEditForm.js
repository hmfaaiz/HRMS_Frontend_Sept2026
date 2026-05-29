import React, { useEffect, useState, useRef, useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { Plus, Search } from "lucide-react";
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
      // textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
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
      <div className="col-span-12 md:col-span-8 lg:col-span-10 flex flex-col bg-white min-w-0 rounded-2xl">
        {/* Header */}
        {/* <div className="flex-shrink-0 text-gray-800 text-xl font-semibold py-4 border-b border-gray-200 px-4">
          <span>AI HR Assistant</span>
        </div> */}
        {/* <hr /> */}

        {/* Messages Container - Scrollable area */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto pt-2 px-4 scrollbar-fancy"
        >
          <div className="h-[66dvh] md:max-h-[66dvh] border-b-2 border-b-black overflow-auto scrollbar-fancy scroll-smooth">
            {currentChat.map((msg, index) => (
              <div key={index} className="mb-3 flex flex-col gap-3">
                {/* QUESTION (right side - 40%) */}
                {msg.question && (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] sm:max-w-[70%] md:max-w-[50%] lg:max-w-[40%] text-sm bg-tprimary text-white px-4 py-2 rounded-xl rounded-br-none leading-6 whitespace-pre-wrap break-words">
                      {msg.question}
                    </div>
                  </div>
                )}

                {(msg.content || msg.processText || msg.isStreaming) && (
                  <div className="flex justify-start">
                    <div
                      className={`
        p-2 w-fit min-w-[80%] max-w-[95%] sm:max-w-[90%] md:max-w-[82%]
        rounded-xl text-sm rounded-bl-none leading-6
        ${msg.isError ? "bg-red-400 text-white" : "bg-tsecondary text-black"}
      `}
                    >
                      {msg.isStreaming && msg.processText && (
                        <div className="flex items-center gap-2 p-1">
                          <span className="spinner spinner-white"></span>
                          <span className="text-sm text-gray-500 ml-4">
                            {msg.processText}...
                          </span>
                        </div>
                      )}

                      {msg.content && !msg.isError && msg.isStreaming && (
                        <div
                          className="assistant-html text-left overflow-x-auto break-words opacity-50"
                          dangerouslySetInnerHTML={{
                            __html: msg.content || "",
                          }}
                        />
                      )}

                      {msg.content && !msg.isError && !msg.isStreaming && (
                        <AssistantHtml
                          key={`${id}-${index}`}
                          html={msg.content || ""}
                          uid={`${id}-${index}`}
                        />
                      )}

                      {msg.isError && (
                        <div className="text-left whitespace-pre-wrap">
                          {msg.content}
                        </div>
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
        <div className="flex-shrink-0 rounded-2xl bg-white px-4 py-3">
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
              {() => (
                <Form className="form form-label-right">
                  <fieldset disabled={actionsLoading}>
                    <div className="relative max-w-[960px] mx-auto">
                      <textarea
                        ref={textareaRef}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="AI Assistant: How can I assist you today?"
                        rows={1}
                        disabled={actionsLoading}
                        style={{ border: "2px solid #0093DD", height: "auto" }}
                        className={` w-full  resize-none  shadow-md shadow-[#0093DD] rounded-full 
                          bg-transparent px-5 py-4 pl-14 text-gray-800 text-sm leading-6  
                          placeholder:text-gray-500
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
                              absolute bottom-[1.25rem] left-3 w-9 h-9 rounded-full bg-tprimary text-white 
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
                        <Search className="w-6 h-6" />
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
    <div className="col-span-12 md:col-span-4 space-y-3 rounded-2xl lg:col-span-2 bg-tprimary border-r px-4 border-gray-200 flex flex-col h-full md:max-h-none max-h-[220px] overflow-hidden">
      {/* New Chat Button */}
      <div className="pt-4 border-b border-gray-200">
        <button
          onClick={handleNewChat}
          className="w-full bg-white border-none text-tprimary font-medium py-2 px-4 rounded-3xl transition duration-200 flex items-center justify-center gap-2 shadow-sm shadow-white hover:shadow-md relative"
        >
          <Plus className="w-5 h-5 text-white bg-tprimary rounded-full p-1 absolute left-4" />
          New Chat
        </button>
      </div>
      <div />
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chatData.length === 0 ? (
          <div className="text-center text-black py-6">No chats available</div>
        ) : (
          <div className="divide-y divide-gray-200 space-y-3">
            {chatData.map((chat) => (
              <div
                key={chat.sessionId}
                title={chat.question}
                onClick={() => handleChatSelect(chat.sessionId)}
                className={`py-2  text-black px-4 space-y-1 rounded-3xl cursor-pointer  ${
                  id == chat?.sessionId ? "bg-tsecondary shadow-md" : "bg-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <span className="text-sm  line-clamp-1">
                      {chat.question}
                    </span>
                    <div className="flex items-center justify-center gap-x-1 ">
                      <span className="text-xs text-tprimary">
                        {formatDate(new Date(chat.createdAt), "dd-MMM-yyyy")}
                      </span>
                      <span className="text-xs bg-tprimary text-white px-1 py-0.5 rounded-md ">
                        {chat.totalMessages}{" "}
                        {chat.totalMessages === 1 ? "message" : "messages"}
                      </span>
                    </div>
                  </div>
                  {/* <ChevronRight className="w-3.5 h-3.5 " /> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const loadScriptOnce = (src) =>
  new Promise((resolve, reject) => {
    if (window.Chart) return resolve(window.Chart);

    const existing = document.querySelector(`script[src="${src}"]`);

    if (existing) {
      existing.addEventListener("load", () => resolve(window.Chart));
      existing.addEventListener("error", reject);
      if (window.Chart) resolve(window.Chart);
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      if (window.Chart) resolve(window.Chart);
      else reject(new Error("Chart.js loaded but window.Chart missing"));
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });

const AssistantHtml = ({ html, uid }) => {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || !html) return;

    let cancelled = false;

    const run = async () => {
      try {
        await loadScriptOnce("https://cdn.jsdelivr.net/npm/chart.js");

        if (cancelled || !window.Chart) return;

        const scripts = Array.from(container.querySelectorAll("script"));
        scripts.forEach((s) => s.remove());

        scripts.forEach((oldScript) => {
          if (oldScript.src) return;

          const code = oldScript.innerHTML;
          if (!code?.trim()) return;

          try {
            new Function("Chart", code)(window.Chart);
          } catch (err) {
            console.error("Assistant script error:", err);
          }
        });
      } catch (err) {
        console.error("Chart load error:", err);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [html, uid]);
  return (
    <div
      ref={ref}
      className="assistant-html text-left overflow-x-auto break-words"
      dangerouslySetInnerHTML={{ __html: html || "" }}
    />
  );
};
