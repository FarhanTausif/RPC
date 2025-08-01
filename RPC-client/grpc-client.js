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

// Create gRPC client
const SERVER_URL = process.env.GRPC_SERVER_URL || 'localhost:50051';
const client = new messagequeueProto.MessageQueue(SERVER_URL, grpc.credentials.createInsecure());

// Helper function to promisify gRPC calls
function promiseCall(method, request) {
  return new Promise((resolve, reject) => {
    client[method](request, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

// Demo functions
async function demoMessageQueue() {
  try {
    console.log('=== gRPC Message Queue Demo ===\n');

    // 1. Enqueue some messages
    console.log('1. Enqueuing messages...');
    const enqueue1 = await promiseCall('enqueue', {
      queue_name: 'test_queue',
      message: 'Hello, World!',
      priority: 1
    });
    console.log('Enqueue result 1:', enqueue1);

    const enqueue2 = await promiseCall('enqueue', {
      queue_name: 'test_queue',
      message: 'High priority message',
      priority: 5
    });
    console.log('Enqueue result 2:', enqueue2);

    const enqueue3 = await promiseCall('enqueue', {
      queue_name: 'test_queue',
      message: 'Another normal message',
      priority: 1
    });
    console.log('Enqueue result 3:', enqueue3);

    // 2. Check queue size
    console.log('\n2. Checking queue size...');
    const sizeResult = await promiseCall('getQueueSize', {
      queue_name: 'test_queue'
    });
    console.log('Queue size:', sizeResult);

    // 3. Peek at the next message
    console.log('\n3. Peeking at next message...');
    const peekResult = await promiseCall('peek', {
      queue_name: 'test_queue'
    });
    console.log('Peek result:', peekResult);

    // 4. Dequeue messages
    console.log('\n4. Dequeuing messages...');
    for (let i = 0; i < 3; i++) {
      const dequeueResult = await promiseCall('dequeue', {
        queue_name: 'test_queue'
      });
      console.log(`Dequeue ${i + 1}:`, dequeueResult);
    }

    // 5. Try to dequeue from empty queue
    console.log('\n5. Trying to dequeue from empty queue...');
    const emptyDequeue = await promiseCall('dequeue', {
      queue_name: 'test_queue'
    });
    console.log('Empty dequeue result:', emptyDequeue);

    // 6. Create another queue and list all queues
    console.log('\n6. Creating another queue and listing all queues...');
    await promiseCall('enqueue', {
      queue_name: 'another_queue',
      message: 'Message in another queue',
      priority: 0
    });

    const listResult = await promiseCall('listQueues', {});
    console.log('All queues:', listResult);

    console.log('\n=== Demo completed successfully! ===');

  } catch (error) {
    console.error('Error during demo:', error);
  }
}

// Run the demo
if (require.main === module) {
  // Wait a bit for server to start if running together
  setTimeout(() => {
    demoMessageQueue().then(() => {
      process.exit(0);
    }).catch((error) => {
      console.error('Demo failed:', error);
      process.exit(1);
    });
  }, 1000);
}

module.exports = { promiseCall, client };