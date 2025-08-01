# 🌐 RPC with Node.js & gRPC Message Queue

A comprehensive Remote Procedure Call (RPC) implementation featuring both HTTP/JSON-RPC and **gRPC-based message queue system** using Node.js. This project demonstrates client-server communication with an in-memory message queue supporting priority-based message handling.

## ✨ Features

- **HTTP JSON-RPC**: Traditional RPC calls (add, multiply operations)
- **gRPC Message Queue**: Full-featured message queue with priority support
- **In-Memory Storage**: Fast, lightweight message storage
- **Priority Queue**: Messages processed by priority (higher first), then FIFO
- **Multiple Operations**: Enqueue, Dequeue, Peek, Queue Size, List Queues

## 📁 Project Structure

```
RPC/
├── messagequeue.proto          # Protocol Buffer definitions
├── RPC-server/
│   ├── rpc-server.js          # HTTP JSON-RPC server
│   ├── grpc-server.js         # gRPC Message Queue server
│   ├── package.json
│   └── .env
├── RPC-client/
│   ├── rpc-client.js          # HTTP JSON-RPC client
│   ├── grpc-client.js         # gRPC Message Queue client
│   ├── package.json
│   └── .env
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
npm install
```

### ▶️ Start the Servers

**Start gRPC Message Queue Server:**
```bash
npm run start:grpc
# or
node grpc-server.js
```

**Start HTTP JSON-RPC Server (original):**
```bash
npm run start:http
# or
node rpc-server.js
```

**Default Ports:**
- gRPC Server: `localhost:50051`
- HTTP Server: `localhost:3000`

---

## 💻 Client Setup

### 🔧 Install Dependencies

```bash
cd RPC-client
npm install
```

### ▶️ Run the Clients

**Run gRPC Message Queue Client:**
```bash
npm run start:grpc
# or
node grpc-client.js
```

**Run HTTP JSON-RPC Client (original):**
```bash
npm run start:http
# or
node rpc-client.js
```

---

## 🚀 gRPC Message Queue API

### Available Operations

1. **Enqueue**: Add message to queue with optional priority
2. **Dequeue**: Remove and return next message from queue
3. **Peek**: View next message without removing it
4. **GetQueueSize**: Get number of messages in queue
5. **ListQueues**: Get list of all queue names

### Message Priority

- Higher priority numbers are processed first
- Same priority messages are processed FIFO
- Default priority: 0

### Example Usage

```javascript
// Enqueue a high priority message
const response = await client.enqueue({
  queue_name: 'my_queue',
  message: 'High priority task',
  priority: 5
});

// Dequeue next message
const message = await client.dequeue({
  queue_name: 'my_queue'
});

// Check queue size
const size = await client.getQueueSize({
  queue_name: 'my_queue'
});
```

---

## 🧪 Sample gRPC Demo Output

```
=== gRPC Message Queue Demo ===

1. Enqueuing messages...
Enqueue result 1: { success: true, message_id: 'msg_1_1754059150488', error: '' }
Enqueue result 2: { success: true, message_id: 'msg_2_1754059150498', error: '' }

2. Checking queue size...
Queue size: { size: 3, error: '' }

3. Peeking at next message...
Peek result: { success: true, message: 'High priority message', message_id: 'msg_2_1754059150498', error: '' }

4. Dequeuing messages...
Dequeue 1: { success: true, message: 'High priority message', message_id: 'msg_2_1754059150498', error: '' }

=== Demo completed successfully! ===
```

---

## 🧪 Sample HTTP RPC Request (Original)

The HTTP client sends a JSON request like:

```json
{
  "jsonrpc": "2.0",
  "method": "add",
  "params": [5, 3],
  "id": 1
}
```

And the server responds with:

```json
{
  "jsonrpc": "2.0",
  "result": 8,
  "id": 1
}
```

---

## 🧰 Technologies Used

- **Node.js**
- **gRPC** (`@grpc/grpc-js`, `@grpc/proto-loader`)
- **Protocol Buffers**
- **Express.js** (for HTTP RPC)
- **Axios** (for HTTP client)
- **In-Memory Message Queue**
- **dotenv** (environment configuration)

---

## 🔧 Configuration

### Server Environment Variables (.env)
```bash
PORT=3000           # HTTP server port
GRPC_PORT=50051     # gRPC server port
```

### Client Environment Variables (.env)
```bash
SERVER_URL=http://localhost:3000      # HTTP RPC server URL
GRPC_SERVER_URL=localhost:50051       # gRPC server URL
```

---

## 🏗️ Architecture

### gRPC Message Queue Features
- **Thread-safe**: In-memory storage with proper synchronization
- **Priority Support**: Higher priority messages processed first
- **FIFO within Priority**: Same priority messages maintain order
- **Error Handling**: Comprehensive error responses
- **Queue Management**: Multiple queues supported
- **Unique Message IDs**: Each message gets a unique identifier

### Message Queue Operations
- **Enqueue**: Adds messages with optional priority
- **Dequeue**: Removes and returns highest priority message
- **Peek**: Views next message without removal
- **Size Check**: Returns current queue size
- **Queue Listing**: Shows all available queues

---