const amqplib = require('amqplib');

async function connectAndSend(routingKey, message) {
  try {
    // Connect to RabbitMQ server
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const exchangeName = 'notification_Exchange';
    const exchangeType = 'topic';

    // Create exchange
    await channel.assertExchange(exchangeName, exchangeType, { durable: false });

    // Publish message
    await channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(message))
    );

    console.log('Message sent:', routingKey, message);

    // Close connection
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.log('Error:', err);
  }
}

// Send two different types of messages
connectAndSend('order.placed', {
  orderID: 123,
  productID: 456,
  status: 'placed'
});

connectAndSend('payment.processed', {
  paymentID: 12345,
  productID: 456,
  status: 'processed'
});
