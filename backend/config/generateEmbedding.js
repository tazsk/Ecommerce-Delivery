// import openai from './openai.js'; // Import the default export

// export const generateEmbedding = async (text) => {
//   try {
//     const response = await openai.embeddings.create({
//       model: 'text-embedding-ada-002',
//       input: text,
//     });
//     return response.data[0].embedding;
//   } catch (err) {
//     console.error('Error generating embedding:', err);
//     throw err;
//   }
// };