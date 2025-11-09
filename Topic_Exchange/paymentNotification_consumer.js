const amqplib = require('amqplib');

async function receivePaymentMessages() {
  try {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const exchangeName = 'notification_Exchange';
    const exchangeType = 'topic';
    const queueName = 'payment_queue';

    await channel.assertExchange(exchangeName, exchangeType, { durable: false });
    await channel.assertQueue(queueName, { durable: false });

    // Bind to all messages starting with 'payment.'
    await channel.bindQueue(queueName, exchangeName, 'payment.*');

    console.log('Waiting for payment messages...');
    await channel.consume(queueName, message => {
      if (message !== null) {
        console.log('Received (Payment Queue):', message.content.toString());
        channel.ack(message);
      }
    });
  } catch (err) {
    console.log('Error:', err);
  }
}

receivePaymentMessages();
