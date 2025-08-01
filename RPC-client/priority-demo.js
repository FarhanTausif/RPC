const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

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
const client = new messagequeueProto.MessageQueue('localhost:50051', grpc.credentials.createInsecure());

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

// Priority queue demonstration
async function demonstratePriorityQueue() {
  try {
    console.log('🚀 Priority Queue Demonstration\n');

    // 1. Enqueue messages with different priorities
    console.log('1. Enqueuing messages with different priorities...');
    
    await promiseCall('enqueue', {
      queue_name: 'priority_demo',
      message: 'Low priority task',
      priority: 1
    });
    console.log('✓ Enqueued: Low priority task (priority: 1)');

    await promiseCall('enqueue', {
      queue_name: 'priority_demo',
      message: 'Medium priority task',
      priority: 3
    });
    console.log('✓ Enqueued: Medium priority task (priority: 3)');

    await promiseCall('enqueue', {
      queue_name: 'priority_demo',
      message: 'High priority URGENT task',
      priority: 10
    });
    console.log('✓ Enqueued: High priority URGENT task (priority: 10)');

    await promiseCall('enqueue', {
      queue_name: 'priority_demo',
      message: 'Another low priority task',
      priority: 1
    });
    console.log('✓ Enqueued: Another low priority task (priority: 1)');

    await promiseCall('enqueue', {
      queue_name: 'priority_demo',
      message: 'Normal priority task',
      priority: 5
    });
    console.log('✓ Enqueued: Normal priority task (priority: 5)');

    // 2. Show processing order
    console.log('\n2. Processing messages (should be by priority, then FIFO)...');
    
    const size = await promiseCall('getQueueSize', { queue_name: 'priority_demo' });
    console.log(`Queue size: ${size.size} messages\n`);

    // Dequeue all messages to show priority order
    for (let i = 1; i <= 5; i++) {
      const result = await promiseCall('dequeue', { queue_name: 'priority_demo' });
      if (result.success) {
        console.log(`${i}. Dequeued: "${result.message}"`);
      }
    }

    console.log('\n✅ Priority demonstration completed!');
    console.log('Notice: Higher priority messages were processed first, with FIFO for same priority.');

  } catch (error) {
    console.error('❌ Error during demonstration:', error);
  }
}

// Run the demonstration
if (require.main === module) {
  setTimeout(() => {
    demonstratePriorityQueue().then(() => {
      process.exit(0);
    }).catch((error) => {
      console.error('Demo failed:', error);
      process.exit(1);
    });
  }, 1000);
}

module.exports = { demonstratePriorityQueue };