import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { Plus, Search, Trash2, Globe, Download } from "lucide-react";
import { formatDate } from "../../../../../utils/common";
import { useFormUIContext } from "../FormUIContext";
import { useDispatch } from "react-redux";
import {
  downloadMessageAsPdf,
  newQuestionClick,
} from "../../../_redux/redux-Actions";

const schema = Yup.object().shape({
  question: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
});

const generatePdfFromHtml = async (html, fileName, questionText, dispatch) => {
  dispatch(downloadMessageAsPdf({ html, fileName , questionText }));
};

export function FormEditForm({
  saveForm,
  currentChat,
  actionsLoading,
  value,
  chatList,
  id,
}) {
  const [question, setQuestion] = useState(value);
  const [isGeneral, setIsGeneral] = useState(false);
  const [downloadingIndex, setDownloadingIndex] = useState(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const dispatch = useDispatch();

  const handleSend = () => {
    if (!question.trim() || actionsLoading) return;
    saveForm({
      question,
      sessionId: currentChat?.length ? currentChat[0]?.sessionId : null,
      isGeneral,
    });
    setQuestion("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleGeneralClick = () => setIsGeneral((p) => !p);

  // ─── PDF Download using html2canvas ────────────────────────────────────
  const downloadMessageAsPdf = useCallback(
    async (index, msg) => {
      const questionText = msg?.question || "";
      const responseHtml = msg?.content || "";

      if (!responseHtml) {
        console.warn("No response content found for index", index);
        return;
      }

      try {
        setDownloadingIndex(index);

        const fileSafeQuestion = (questionText || "response")
          .replace(/[^a-z0-9]/gi, "_")
          .substring(0, 30);

        await generatePdfFromHtml(
          responseHtml,
          `AI-${fileSafeQuestion}-${Date.now()}.pdf`,
          questionText,
          dispatch,
        );
      } catch (err) {
        console.error("PDF download error:", err);
        alert("Failed to generate PDF. Please try again.");
      } finally {
        setDownloadingIndex(null);
      }
    },
    [isGeneral],
  );

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [question]);

  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [currentChat]);

  return (
    <div className="grid grid-cols-12 gap-x-2 overflow-hidden">
      <ChatListComp chatData={chatList} id={id} />
      <div className="col-span-12 md:col-span-8 lg:col-span-10 flex flex-col max-h-[80dvh] bg-white min-w-0 rounded-2xl">
        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto pt-2 px-4 scrollbar-fancy"
        >
          <div className="h-[64dvh] md:max-h-[64dvh] border-b-2 border-b-black overflow-auto scrollbar-fancy scroll-smooth">
            {currentChat.map((msg, index) => (
              <div key={index} className="mb-3 flex flex-col gap-3">
                {/* QUESTION */}
                {msg.question && (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] sm:max-w-[70%] md:max-w-[50%] lg:max-w-[40%] text-sm bg-tprimary text-white px-4 py-2 rounded-xl rounded-br-none leading-6 whitespace-pre-wrap break-words">
                      {msg.question}
                    </div>
                  </div>
                )}

                {/* ASSISTANT RESPONSE */}
                {(msg.content || msg.processText || msg.isStreaming) && (
                  <div className="flex justify-start">
                    <div
                      className={`
                        p-2 w-fit min-w-[80%] max-w-[95%] sm:max-w-[90%] md:max-w-[82%]
                        rounded-xl text-sm rounded-bl-none leading-6
                        ${
                          msg.isError
                            ? "bg-red-400 text-white"
                            : "bg-tsecondary text-black"
                        }
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

                      {/* Download Button */}
                      {msg.content && !msg.isStreaming && !msg.isError && (
                        <div className="flex justify-end mt-2 pt-1 border-t border-gray-200">
                          <button
                            onClick={() => downloadMessageAsPdf(index, msg)}
                            disabled={
                              downloadingIndex === index || actionsLoading
                            }
                            title="Download this response as PDF"
                            className={`flex items-center gap-1 text-xs transition-colors bg-transparent border-none duration-150 cursor-pointer
                              ${
                                downloadingIndex === index
                                  ? "text-tprimary opacity-60 cursor-wait"
                                  : "text-black hover:text-tprimary"
                              }`}
                          >
                            {downloadingIndex === index ? (
                              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-tprimary border-t-transparent"></span>
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </button>
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

        {/* Input Area */}
        <div className="flex-shrink-0 rounded-2xl bg-white px-4 py-3">
          <div className="w-full">
            <Formik
              enableReinitialize={true}
              initialValues={{ question: value || "" }}
              validationSchema={schema}
              onSubmit={() => {
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
                        placeholder={
                          !isGeneral
                            ? "AI Assistant: How can I assist you today in discovering BasharOne AI Analytics."
                            : "AI Assistant: How can I assist you today for searching General Question from AI."
                        }
                        rows={1}
                        disabled={actionsLoading}
                        style={{
                          border: "1.5px solid #0093DD",
                          height: "auto",
                        }}
                        className={`w-full resize-none shadow-[0_0_15px_#0093DD] rounded-full 
                          bg-transparent px-5 py-4 pl-14 pr-14 text-gray-800 text-sm leading-6  
                          placeholder:text-gray-500
                          ${
                            actionsLoading
                              ? "opacity-60 cursor-not-allowed"
                              : "opacity-100 cursor-text"
                          }`}
                      />

                      {/* Send Button */}
                      <button
                        type="submit"
                        onClick={handleSend}
                        disabled={actionsLoading || !question.trim()}
                        className={`absolute bottom-[1.25rem] left-3 w-9 h-9 rounded-full bg-tprimary text-white 
                          border-none outline-none flex items-center justify-center transition-all 
                          ${
                            actionsLoading || !question.trim()
                              ? "opacity-50 cursor-not-allowed"
                              : "opacity-100 cursor-pointer hover:scale-105 hover:bg-tprimary/90"
                          }`}
                        title={
                          actionsLoading
                            ? "Waiting for response..."
                            : "Send message"
                        }
                      >
                        <Search className="w-6 h-6" />
                      </button>

                      {/* Globe Button */}
                      <button
                        type="button"
                        onClick={handleGeneralClick}
                        disabled={actionsLoading}
                        className={`absolute bottom-[1.25rem] right-3 w-9 h-9 rounded-full 
                          border-none outline-none flex items-center justify-center transition-all hover:scale-105
                          ${
                            isGeneral
                              ? "bg-tprimary text-white"
                              : "bg-tsecondary text-gray-600"
                          }
                          ${
                            actionsLoading
                              ? "opacity-50 cursor-not-allowed"
                              : "opacity-100 cursor-pointer"
                          }`}
                        title={
                          isGeneral
                            ? "General Mode Active"
                            : "Switch to General Mode"
                        }
                        style={{
                          boxShadow: isGeneral
                            ? "0 0 10px rgba(0, 147, 221, 0.5)"
                            : "0 0 5px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Globe className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-1 px-1 gap-2 flex flex-col">
                      <span className="text-gray-400 text-xs">
                        Information generated by AI may occasionally be
                        incomplete or outdated; please verify critical details
                        using BasharOne HRMS data or reports.
                      </span>
                      <span
                        className={`text-xs font-bold whitespace-nowrap ${
                          isGeneral ? "text-green-600" : "text-blue-600"
                        }`}
                      >
                        {isGeneral
                          ? "🟢 General Mode is Activated"
                          : "🔵 AI Analysis Mode Activated"}
                      </span>
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

// ─── ChatListComp ─────────────────────────────────────────────────────────────
const ChatListComp = ({ chatData = [], id }) => {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();

  const FormUIProps = useMemo(
    () => ({
      newFormButtonClick: FormUIContext.newFormButtonClick,
      existingButtonClick: FormUIContext.existingButtonClick,
      setDeleteId: FormUIContext.setDeleteId,
    }),
    [FormUIContext],
  );

  const handleNewChat = () => {
    FormUIProps.newFormButtonClick();
    dispatch(newQuestionClick());
  };

  const handleChatSelect = (sessionId) =>
    FormUIProps.existingButtonClick(sessionId);

  return (
    <div className="col-span-12 max-h-[80dvh] md:col-span-4 space-y-3 rounded-2xl lg:col-span-2 bg-tprimary px-4 flex flex-col">
      <div className="pt-4 border-b border-gray-200">
        <button
          onClick={handleNewChat}
          style={{ border: "1.5px solid #0093dd" }}
          className="w-full bg-white border-none text-tprimary font-medium py-2 px-4 rounded-3xl transition duration-200 flex items-center justify-center gap-2 shadow-[0_0_10px_#FFFFFF] hover:shadow-[0_0_15px_#e6f8ff] relative"
        >
          <Plus className="w-5 h-5 text-white bg-tprimary rounded-full p-1 absolute left-4" />
          New Chat
        </button>
      </div>
      <div />
      <div className="flex-1 overflow-y-auto scrollbar-track-tprimary">
        {chatData.length === 0 ? (
          <div className="text-center text-black py-6">No chats available</div>
        ) : (
          <div className="space-y-3">
            {chatData.map((chat) => (
              <div
                key={chat.sessionId}
                title={chat.question}
                onClick={() => handleChatSelect(chat.sessionId)}
                className={`group relative py-2 text-black px-4 space-y-1 rounded-full cursor-pointer ${
                  id == chat?.sessionId
                    ? "bg-tsecondary shadow-md"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <span className="text-sm line-clamp-1">
                      {chat.question}
                    </span>
                    <div className="flex items-center justify-between gap-x-1">
                      <span className="text-xs text-tprimary">
                        {formatDate(new Date(chat.createdAt), "dd-MMM-yyyy")}
                      </span>
                      <button
                        title="Delete Chat"
                        onClick={(e) => {
                          e.stopPropagation();
                          FormUIProps.setDeleteId(chat?.sessionId);
                        }}
                        className="p-0 shadow-sm border border-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── loadScriptOnce ───────────────────────────────────────────────────────────
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

// ─── AssistantHtml ────────────────────────────────────────────────────────────
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
