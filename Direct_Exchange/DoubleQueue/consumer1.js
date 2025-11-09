// consumer queue

const amqplib = require('amqplib')

async function consumeMail () {
  try {
    const connection = await amqplib.connect('amqp://localhost')
    const channel = await connection.createChannel()
    const exchangeName = 'mailExchange'
    const routingKey = 'send_mail_to_subscribed_user'
    const queueName = 'mailQueue1'

    await channel.assertExchange(exchangeName, 'direct', { durable: false })
    await channel.assertQueue(queueName, { durable: false })
    await channel.bindQueue(queueName, exchangeName, routingKey)
    await channel.consume(queueName, (message) => {
      if (message !== null) {
        console.log(message.content.toString())
      }
    })
  } catch (err) {
    console.log(err)
  }
}


consumeMail()