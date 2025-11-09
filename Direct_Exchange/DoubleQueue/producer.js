const amqp = require('amqplib')

async function connectAndSend () {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()

    const exchangeName = 'mailExchange'
    const queue1 = 'mailQueue1'
    const queue2 = 'mailQueue2'
    const routingKey1 = 'send_mail_to_subscribed_user'
    const routingKey2 = 'send_mail_to_user'

    const message1 = 'Hello from Queue 1!'
    const message2 = 'Hello from Queue 2!'

    // Create exchange
    await channel.assertExchange(exchangeName, 'direct', { durable: false })

    // Queue 1 setup
    await channel.assertQueue(queue1, { durable: false })
    await channel.bindQueue(queue1, exchangeName, routingKey1)
    await channel.publish(
      exchangeName,
      routingKey1,
      Buffer.from(JSON.stringify(message1))
    )

    // Queue 2 setup
    await channel.assertQueue(queue2, { durable: false })
    await channel.bindQueue(queue2, exchangeName, routingKey2)
    await channel.publish(
      exchangeName,
      routingKey2,
      Buffer.from(JSON.stringify(message2))
    )

    console.log(`Sent to ${queue1}: ${message1}`)
    console.log(`Sent to ${queue2}: ${message2}`)

    // Close connection
    setTimeout(() => {
      connection.close()
      process.exit(0)
    }, 500)
  } catch (error) {
    console.error('Error:', error)
  }
}

connectAndSend()
