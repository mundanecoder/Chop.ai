// import React, { useState, useEffect } from 'react';
// import { ChatOpenAI } from '@langchain/openai';
// import { PromptTemplate } from '@langchain/core/prompts';
// import { StringOutputParser } from '@langchain/core/output_parsers';
// import { RunnableSequence,RunnablePassthrough } from "@langchain/core/runnables";

// const App = () => {
//   const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;
//   const llm = new ChatOpenAI({ openAIApiKey });

//   const [sentence, setSentence] = useState('i dont liked mondays');
//   const [response, setResponse] = useState(null);
//   const [error, setError] = useState(null);

//   const grammarTemplate = `Given a sentence, correct the grammar.
//   sentence: {punctuated_sentence}
//   sentence with correct grammar:
//   `;

//   const translationTemplate = `Given a sentence, translate that sentence into {language}
//     sentence: {grammatically_correct_sentence}
//     translated sentence:
//     `;

//   const punctuationTemplate = `Given a sentence, add punctuation where needed.
//   sentence: {sentence}
//   sentence with punctuation:
//   `

// const grammarPrompt = PromptTemplate.fromTemplate(grammarTemplate);
// const punctuationPrompt = PromptTemplate.fromTemplate(punctuationTemplate)
// const translationPrompt = PromptTemplate.fromTemplate(translationTemplate)

// const Punctuationchain = RunnableSequence.from([punctuationPrompt, llm,new StringOutputParser()])

// const grammarChain = RunnableSequence.from ([grammarPrompt,llm,new StringOutputParser()])
// const translationChain = RunnableSequence.from([translationPrompt,llm,new StringOutputParser()])

// const chain  = RunnableSequence.from([
//   {
//     punctuated_sentence:Punctuationchain,
//     original_input: new RunnablePassthrough()
//   },
//   {
//     grammatically_correct_sentence:grammarChain,
//     language:({original_input}) =>original_input.language

//   },
//   translationChain

// ])

//   // const chain = RunnableSequence.from([
//   //   ({ sentence }) => `Given a sentence, add punctuation where needed.
//   //                       sentence: ${sentence}
//   //                       sentence with punctuation:
//   //                       `,
//   //   llm.pipe(new StringOutputParser()),
//   // ]);

//   const handleSubmit = async () => {
//     try {
//       const res = await chain.invoke({ sentence ,language:"Assamese"});
//       setResponse(res);
//       setError(null);
//     } catch (error) {
//       console.error('Error:', error);
//       setError('An error occurred. Please try again later.');
//     }
//   };

//   useEffect(() => {
//     handleSubmit();
//   }, []);

//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//       <input
//         type="text"
//         value={sentence}
//         onChange={(e) => setSentence(e.target.value)}
//         style={{ marginBottom: '10px' }}
//       />
//       <button onClick={handleSubmit}>Correct Grammar</button>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {response && <p>Corrected Sentence: {response}</p>}
//     </div>
//   );
// };

// export default App;
