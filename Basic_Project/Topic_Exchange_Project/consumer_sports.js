const amqplib = require('amqplib')

const receiveSports = async () => {
  try {
    const connection = await amqplib.connect('amqp://localhost')
    const channel = await connection.createChannel()

    const exchange = 'topic_logs'
    await channel.assertExchange(exchange, 'topic', { durable: false })

    const queueName = 'sports_queue'
    await channel.assertQueue(queueName, { durable: false })

    await channel.bindQueue(queueName, exchange, 'news.sports.*')

    console.log('Waiting for news.sports.* messages...')
    await channel.consume(queueName, message => {
      if (message !== null) {
        console.log('Received (Sports Queue):', message.content.toString())
        channel.ack(message)
      }
    })

    setTimeout(() => {
      connection.close()
    }, 500)
  } catch (error) {
    console.log(error)
  }
}

receiveSports()
