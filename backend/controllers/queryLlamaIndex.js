import axios from 'axios';

const queryLlamaIndex = async (query) => {
  try {
    console.log("Query:", query);
    
    const response = await axios.post('http://127.0.0.1:5000/query', { query }, {
      headers: { 'Content-Type': 'application/json' },
    });
  
    console.log("Response Data:", response.data);
    
    return response.data.matched_titles;
  } catch (error) {
    console.error('Error querying LlamaIndex:', error.response?.data || error.message);
    throw error;
  }
};

export default queryLlamaIndex;
