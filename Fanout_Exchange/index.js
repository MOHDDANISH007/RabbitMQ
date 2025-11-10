const amqplib = require('amqplib')

const sendingMessageToAllQueues = async () => {
  try {
    const connection = await amqplib.connect('amqp://localhost')
    const channel = await connection.createChannel()

    const exchangeName = 'fanoutExchange'
    const exchangeType = 'fanout'

    await channel.assertExchange(exchangeName, exchangeType, { durable: false })

    const message = {
      message: '🚨 Server is down!! 🚨'
    }

    await channel.publish(
      exchangeName,
      '',
      Buffer.from(JSON.stringify(message))
    )
    console.log('Message sent:', message)

    // ✅ Add a short delay before closing
    setTimeout(() => {
      connection.close()
    }, 500)

  } catch (err) {
    console.log(err)
  }
}

sendingMessageToAllQueues()
