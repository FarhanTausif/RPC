const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// Load the protobuf
const PROTO_PATH = path.join(__dirname, '../messagequeue.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const messagequeueProto = grpc.loadPackageDefinition(packageDefinition).messagequeue;

// In-memory message queue storage
class MessageQueue {
  constructor() {
    this.queues = new Map(); // Map<queueName, Array<{id, message, priority, timestamp}>>
    this.messageIdCounter = 0;
  }

  generateMessageId() {
    return `msg_${++this.messageIdCounter}_${Date.now()}`;
  }

  enqueue(queueName, message, priority = 0) {
    if (!this.queues.has(queueName)) {
      this.queues.set(queueName, []);
    }

    const messageObj = {
      id: this.generateMessageId(),
      message: message,
      priority: priority,
      timestamp: Date.now()
    };

    const queue = this.queues.get(queueName);
    queue.push(messageObj);
    
    // Sort by priority (higher priority first), then by timestamp (FIFO for same priority)
    queue.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority; // Higher priority first
      }
      return a.timestamp - b.timestamp; // FIFO for same priority
    });

    return messageObj.id;
  }

  dequeue(queueName) {
    if (!this.queues.has(queueName) || this.queues.get(queueName).length === 0) {
      return null;
    }

    const queue = this.queues.get(queueName);
    return queue.shift(); // Remove and return first element
  }

  peek(queueName) {
    if (!this.queues.has(queueName) || this.queues.get(queueName).length === 0) {
      return null;
    }

    const queue = this.queues.get(queueName);
    return queue[0]; // Return first element without removing
  }

  getQueueSize(queueName) {
    if (!this.queues.has(queueName)) {
      return 0;
    }
    return this.queues.get(queueName).length;
  }

  listQueues() {
    return Array.from(this.queues.keys());
  }
}

// Create message queue instance
const messageQueue = new MessageQueue();

// gRPC service implementation
const messageQueueService = {
  enqueue: (call, callback) => {
    try {
      const { queue_name, message, priority } = call.request;
      const messageId = messageQueue.enqueue(queue_name, message, priority || 0);
      
      callback(null, {
        success: true,
        message_id: messageId,
        error: ''
      });
    } catch (error) {
      callback(null, {
        success: false,
        message_id: '',
        error: error.message
      });
    }
  },

  dequeue: (call, callback) => {
    try {
      const { queue_name } = call.request;
      const messageObj = messageQueue.dequeue(queue_name);
      
      if (messageObj) {
        callback(null, {
          success: true,
          message: messageObj.message,
          message_id: messageObj.id,
          error: ''
        });
      } else {
        callback(null, {
          success: false,
          message: '',
          message_id: '',
          error: 'Queue is empty or does not exist'
        });
      }
    } catch (error) {
      callback(null, {
        success: false,
        message: '',
        message_id: '',
        error: error.message
      });
    }
  },

  peek: (call, callback) => {
    try {
      const { queue_name } = call.request;
      const messageObj = messageQueue.peek(queue_name);
      
      if (messageObj) {
        callback(null, {
          success: true,
          message: messageObj.message,
          message_id: messageObj.id,
          error: ''
        });
      } else {
        callback(null, {
          success: false,
          message: '',
          message_id: '',
          error: 'Queue is empty or does not exist'
        });
      }
    } catch (error) {
      callback(null, {
        success: false,
        message: '',
        message_id: '',
        error: error.message
      });
    }
  },

  getQueueSize: (call, callback) => {
    try {
      const { queue_name } = call.request;
      const size = messageQueue.getQueueSize(queue_name);
      
      callback(null, {
        size: size,
        error: ''
      });
    } catch (error) {
      callback(null, {
        size: 0,
        error: error.message
      });
    }
  },

  listQueues: (call, callback) => {
    try {
      const queueNames = messageQueue.listQueues();
      
      callback(null, {
        queue_names: queueNames
      });
    } catch (error) {
      callback(null, {
        queue_names: []
      });
    }
  }
};

// Create and start gRPC server
function startGrpcServer() {
  const server = new grpc.Server();
  server.addService(messagequeueProto.MessageQueue.service, messageQueueService);
  
  const PORT = process.env.GRPC_PORT || 50051;
  const bindAddress = `0.0.0.0:${PORT}`;
  
  server.bindAsync(bindAddress, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      console.error('Failed to start gRPC server:', error);
      return;
    }
    console.log(`gRPC Message Queue Server running at ${bindAddress}`);
    server.start();
  });
}

// Start the gRPC server
startGrpcServer();