const amqplib = require('amqplib');

async function receiveOrderMessages() {
  try {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const exchangeName = 'notification_Exchange';
    const exchangeType = 'topic';
    const queueName = 'order_queue';

    await channel.assertExchange(exchangeName, exchangeType, { durable: false });
    await channel.assertQueue(queueName, { durable: false });

    // Bind to all messages starting with 'order.'
    await channel.bindQueue(queueName, exchangeName, 'order.*');

    console.log('Waiting for order messages...');
    await channel.consume(queueName, message => {
      if (message !== null) {
        console.log('Received (Order Queue):', message.content.toString());
        channel.ack(message);
      }
    });
  } catch (err) {
    console.log('Error:', err);
  }
}

receiveOrderMessages();
