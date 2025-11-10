// subscriber.js
const amqp = require("amqplib");

const startConsumer = async (serviceName) => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchangeName = "fanoutExchange";
    const exchangeType = "fanout";

    await channel.assertExchange(exchangeName, exchangeType, { durable: false });

    // ✅ Use a named queue instead of temporary one
    const q = await channel.assertQueue(serviceName, { durable: false });

    await channel.bindQueue(q.queue, exchangeName, "");

    console.log(`✅ [${serviceName}] Waiting for messages...`);

    channel.consume(q.queue, (msg) => {
      if (msg.content) {
        console.log(`📩 [${serviceName}] Received: ${msg.content.toString()}`);
      }
    }, { noAck: true });

  } catch (error) {
    console.error("Error:", error);
  }
};

// Start consumers
startConsumer("Logging_Service");