const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

const rpcMethods = {
  add: ([a, b]) => a + b,
  multiply: ([a, b]) => a * b
};

app.post('/rpc', (req, res) => {
  const { method, params, id } = req.body;

  if (rpcMethods[method]) {
    const result = rpcMethods[method](params);
    res.json({ jsonrpc: "2.0", result, id });
  } else {
    res.json({ jsonrpc: "2.0", error: "Method not found", id });
  }
});

// app.listen(PORT, () => console.log('RPC Server running on port 3000'));
app.listen(PORT, '0.0.0.0', () => {
  console.log(`JSON-RPC Server running at http://0.0.0.0:${PORT}`);
});
