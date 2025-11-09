const amqplib = require('amqplib')

async function sendMail () {
  try {
    const connection = await amqplib.connect('amqp://localhost')
    const channel = await connection.createChannel()
    const exchangeName = 'mailExchange'
    const routingKey = 'mailRoutingKey'
    const queueName = 'mail'

    const message = {
      to: 'kashif@gmail',
      from: 'danish@gmail',
      subject: 'Hello TP mail',
      body: 'Hello Kashif, How are you?'
    }

    await channel.assertExchange(exchangeName, 'direct', { durable: false })
    await channel.assertQueue(queueName, { durable: false })
    await channel.bindQueue(queueName, exchangeName, routingKey)
    await channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(message))
    )
    console.log('Mail Data was Sent : ', message)
  } catch (err) {
    console.log(err)
  }
}

sendMail()