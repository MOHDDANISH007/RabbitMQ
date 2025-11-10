// consumer_movies.js
const amqplib = require('amqplib')

const receiveMovies = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const exchange = 'topic_logs';
  await channel.assertExchange(exchange, 'topic', { durable: false });

  const q = await channel.assertQueue('', { exclusive: true });

  const pattern = 'news.movies.*';
  await channel.bindQueue(q.queue, exchange, pattern);

  console.log(`🎬 Waiting for messages with pattern '${pattern}'...`);
  channel.consume(
    q.queue,
    (msg) => console.log(`📩 [MOVIES] ${msg.fields.routingKey}: ${msg.content.toString()}`),
    { noAck: true }
  );
};

receiveMovies();
