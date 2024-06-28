// import React, { useState, useEffect } from 'react';
// import { ChatOpenAI } from "@langchain/openai";
// import { PromptTemplate } from "@langchain/core/prompts";
// import { StringOutputParser } from '@langchain/core/output_parsers'
// import { retriever, combineResponse } from './utils/retriever';
// const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;

// const llm = new ChatOpenAI({ openAIApiKey });

// const App = () => {
//   const [question, setQuestion] = useState('');
//   const [response, setResponse] = useState("");

//   const standaloneQuestionTemplate =
//     "Given a question, convert it to a standalone question. question: {question} context: {context}";

//   const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
//     standaloneQuestionTemplate
//   );
//   const chain = standaloneQuestionPrompt.pipe(llm).pipe(new StringOutputParser()).pipe(retriever).pipe(combineResponse);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const result = await chain.invoke({ question, context: response });
//     setResponse(result);
//   };

//   // Log response only after it updates
//   useEffect(() => {
//     console.log(response);
//   }, [response]);

//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center',
//       width: '100vw',
//       height: "100vh",
//     }}>
//       <form onSubmit={handleSubmit} style={{
//         display: 'flex',
//         flexDirection: 'column',
//         gap: 2
//       }}>
//         <div style={{
//           width: "30vw",
//           display: 'flex',
//           justifyContent: 'center',
//           gap: "30px",
//           marginBottom: "20px"
//         }}>
//           <label>
//             Enter your question:
//           </label>
//           <input
//             type="text"
//             value={question}
//             style={{
//               height: "20px"
//             }}
//             onChange={(e) => setQuestion(e.target.value)}
//           />
//         </div>
//         <button type="submit">Submit</button>
//       </form>
//       <div style={{
//         width: "40%",
//         height: "40%",
//         border: "1px solid red",
//         color: "white",
//         display: "flex",
//         flexDirection: "column",
//         gap: 10
//       }}>
//         {/* Display the response here */}
//         {response && <p>{response}</p>}
//       </div>
//     </div>
//   );
// };

// export default App;
