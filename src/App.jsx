import React, { useState, useEffect, useRef } from "react";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
// import { dummydata } from "./constants/gptChats";
import Typewriter from "typewriter-effect";

import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { combineDocuments, retriever } from "./utils/retriever";

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;
const llm = new ChatOpenAI({
  openAIApiKey,
});

const standaloneQuestionTemplate =
  "Given a question, convert it to a standalone question. question: {question} standalone question:";
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  standaloneQuestionTemplate
);

const answerTemplate = `
Politeness and Helpfulness:
Chop AI strives to be polite and helpful in all interactions. We aim to provide clear and informative answers to your finance-related questions.

Chop AI is an impressive platform that can assist you in a variety of ways:

1. Comprehensive Finance Education
   - Chop AI provides in-depth insights and analysis on key finance topics like investment banking, hedge funds, and private equity.
   - Helps you gain a deeper understanding of these complex domains and make more informed decisions.

2. Improved Financial Literacy
   - Offers resources to enhance your overall financial literacy.
   - Teaches best practices for investing, risk management, and personal finance.
   - Empowers you to take control of your financial future.

3. FinTech Expertise
   - Keeps you up-to-date on the latest trends and developments in the rapidly evolving FinTech industry.
   - Helps you stay ahead of the curve and capitalize on new opportunities.

4. Career Advancement
   - Provides valuable guidance and resources for professional development in finance.
   - Assists whether you're just starting out or looking to take your career to the next level.

5. Tax-related Resources
   - Offers top-notch tax-related resources to help you navigate the complex world of tax planning and compliance.
   - Ensures you maximize your deductions and minimize your liability.

6. Fun Factor
   - Known for witty banter and occasional dad jokes from the team.
   - Makes learning about finance enjoyable.

7. Expert Advice
   - Designed to assist like a knowledgeable Chartered Accountant (CA).
   - Provides expert advice and support in finance-related matters.

8. Support
   - For personalized recommendations, reach out to our support team at help@chop.com.
   - Always happy to assist and provide recommendations based on your specific needs and goals.

Note for Chop AI:
Always answer in a more articulated manner, not in paragraphs, always starts with 3-10 lines summarizing the overall context of the answer.
Ensure the answers are well-comprehended, easy to read, and understandable.

Important: Chop AI answers only finance-related questions and basic etiquettes. For any other inquiries, respond with "I don't offer this service. Please contact help@chop.com."

Context: {context}
Question: {question}
Conversation History: {conversation_history}
Answer:
`;
const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

const standaloneQuestionChain = standaloneQuestionPrompt
  .pipe(llm)
  .pipe(new StringOutputParser());

const retrieverChain = RunnableSequence.from([
  (prevResult) => prevResult.standalone_question,
  retriever,
  combineDocuments,
]);

const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser());

const chain = RunnableSequence.from([
  {
    standalone_question: standaloneQuestionChain,
    original_input: new RunnablePassthrough(),
  },
  {
    context: retrieverChain,
    question: ({ original_input }) => original_input.question,
    conversation_history: ({ original_input }) =>
      original_input.conversation_history,
  },
  answerChain,
]);

const App = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [stopTyping, setStopTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const gptMessagesEndRef = useRef(null);
  const typewriterRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleResponse = async (responseText) => {
    setIsTyping(true);
    setTimeout(() => {
      const gptMessage = { sender: "gpt", text: responseText };
      setMessages((prevMessages) => [...prevMessages, gptMessage]);
      setIsTyping(false);
      scrollToBottom();
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = { sender: "user", text: question };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setQuestion("");
    setIsTyping(true);
    setStopTyping(false);

    const conversationHistory = updatedMessages
      .map((msg) => `${msg.sender}: ${msg.text}`)
      .join("\n");

    try {
      const result = await chain.invoke({
        question,
        conversation_history: conversationHistory,
      });

      const responseText =
        result.trim() || "I'm sorry, I don't know the answer to that.";
      setTimeout(() => handleResponse(responseText), 500);
    } catch (error) {
      const errorMessage = {
        sender: "gpt",
        text: "There was an error processing your request. Please try again later.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      setIsTyping(false);
    }
  };

  const stopGenerating = () => {
    setStopTyping(true);
    if (typewriterRef.current) {
      typewriterRef.current.stop();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#343541",
        color: "#f1f1f1",
        position: "relative",
      }}
    >
      <div
        style={{
          top: "10px",
          position: "absolute",
          display: "flex",
          fontSize: "24px",
          justifyContent: "center",
          alignItems: "center",
          width: "98%",
          padding: "0px 10px 0px 10px",
        }}
      >
        <h3 style={{ color: "#10a37f" }}>Chop.Ai</h3>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "90%",
          width: "98%",
          marginTop: "6vh",
        }}
      >
        {/* <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "15%",
            borderRadius: "5px",
            background: "#202123",
            color: "#f1f1f1",
            padding: "10px",
            marginRight: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            overflowY: "auto",
          }}
        >
          <h3
            style={{
              color: "#10a37f",
              marginBottom: "10px",
              textAlign: "center",
            }}
          > */}
        {/* Conversation History */}
        {/* </h3> */}
        {/* {dummydata.map((period, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <h4 style={{ marginBottom: "10px" }}>{period.period}</h4>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {period.chats.map((chat, idx) => (
                  <li
                    key={idx}
                    style={{
                      marginBottom: "5px",
                      padding: "5px",
                      borderRadius: "5px",
                      backgroundColor: "#40414f",
                      boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <span style={{ color: "#b0b0b0" }}>
                      {Object.values(chat.content)[0]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))} */}
        {/* </div> */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "96%",
            width: "70%",
            paddingBottom: "10px",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "80%",
              height: "90%",
              borderRadius: "10px",
              padding: "10px",
              overflowY: "scroll",
              marginBottom: "20px",
              background: "#434451",
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  fontSize: "1.2rem",
                  color: "#b0b0b0",
                }}
              >
                <span>Start a conversation with Chop.Ai 💬</span>
                <span>Ask me anything! 🤔</span>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                    margin: "10px 0",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "60%",
                      padding: "10px",
                      borderRadius: "10px",
                      backgroundColor:
                        msg.sender === "user" ? "#156b55" : "#183f35",
                      color: "#f1f1f1",
                    }}
                  >
                    {msg.sender === "gpt" && index === messages.length - 1 ? (
                      <Typewriter
                        onInit={(typewriter) => {
                          typewriterRef.current = typewriter;
                          typewriter
                            .typeString(msg.text)
                            .callFunction(() => {
                              console.log("String typed out!");
                              scrollToBottom();
                            })
                            .start();
                        }}
                        options={{
                          strings: [msg.text],
                          delay: 20,
                          loop: false,
                          cursor: "",
                        }}
                      />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  margin: "10px 0",
                }}
              >
                <div
                  style={{
                    maxWidth: "60%",
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor: "#183f35",
                    color: "#75a095",
                  }}
                >
                  Typing... 🤖
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              width: "74%",
            }}
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #40414f",
                marginRight: "10px",
                backgroundColor: "#40414f",
                color: "#f1f1f1",
                cursor: "text",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#10a37f",
                color: "#f1f1f1",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Send 🚀
            </button>
            <button
              type="button"
              onClick={stopGenerating}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#f44336",
                color: "#f1f1f1",
                cursor: "pointer",
              }}
            >
              Stop Generating ⛔
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
