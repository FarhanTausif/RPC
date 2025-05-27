# 🌐 RPC with Node.js

A simple Remote Procedure Call (RPC) implementation using Node.js, Express, and Axios. This project demonstrates how to perform RPC communication between a client and a server over HTTP using JSON, either on the same network or via tunnels like **Ngrok**.

## 📁 Project Structure

```
RPC/
├── RPC-server/
│   ├── rpc-server.js
│   └── package.json
├── RPC-client/
│   ├── rpc-client.js
│   └── package.json
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/FarhanTausif/RPC.git
cd RPC
```

---

## 🖥️ Server Setup

### 🔧 Install Dependencies

```bash
cd RPC-server
npm install express body-parser dotenv ngrok 
```

### ▶️ Start the Server

```bash
node rpc-server.js
```

By default, the server runs at:  
`http://localhost:3000/rpc`

If you're running across different networks, use [Ngrok](https://ngrok.com):

```bash
ngrok http 3000
```

Use the HTTPS forwarding URL from Ngrok (e.g., `https://abc123.ngrok-free.app`) in your client.

---

## 💻 Client Setup

### 🔧 Install Dependencies

```bash
cd RPC-client
npm install
```

### 📝 Update RPC URL in `rpc-client.js`

```js
const SERVER_URL = "<server_ip_address>/rpc"; // Or your ngrok HTTPS URL
```

### ▶️ Run the Client

```bash
node rpc-client.js
```

---

## 🧪 Sample RPC Request

The client sends a JSON request like:

```json
{
  "method": "add",
  "params": [5, 3]
}
```

And the server responds with:

```json
{
  "result": 8
}
```

---

## 🧰 Technologies Used

- **Node.js**
- **Express.js**
- **Axios**
- **Ngrok (optional for tunneling)**
- **body-parser**
- **dotenv**

---