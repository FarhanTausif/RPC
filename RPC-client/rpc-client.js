const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// Replace this with the actual server IP
const SERVER_URL =`${process.env.SERVER_URL}/rpc`;

const requestData = {
  jsonrpc: '2.0',
  method: 'add',
  params: [10, 15],
  id: 1,
};

// console.log(SERVER_URL);
axios.post(SERVER_URL, requestData)
  .then(response => {
    console.log('Response from server:', response.data);
  })
  .catch(error => {
    console.error('Error calling RPC server:', error.message);
  });
