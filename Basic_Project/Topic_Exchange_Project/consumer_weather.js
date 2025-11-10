// consumer_weather.js
const amqplib = require('amqplib')

const receiveWeather = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const exchange = 'topic_logs';
  await channel.assertExchange(exchange, 'topic', { durable: false });

  const q = await channel.assertQueue('', { exclusive: true });

  const pattern = 'news.weather.#'; // many words after "weather"
  await channel.bindQueue(q.queue, exchange, pattern);

  console.log(`🌦️ Waiting for messages with pattern '${pattern}'...`);
  channel.consume(
    q.queue,
    (msg) => console.log(`📩 [WEATHER] ${msg.fields.routingKey}: ${msg.content.toString()}`),
    { noAck: true }
  );
};

receiveWeather();
