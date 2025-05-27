const axios = require('axios');

// Replace this with the actual server IP
const SERVER_URL = 'http://10.42.0.138:3000/rpc';

const requestData = {
  jsonrpc: '2.0',
  method: 'add',
  params: [10, 15],
  id: 1,
};

axios.post(SERVER_URL, requestData)
  .then(response => {
    console.log('Response from server:', response.data);
  })
  .catch(error => {
    console.error('Error calling RPC server:', error.message);
  });
