const amqplib = require('amqplib')

async function connectAndSend() {
  try {
    const connectionWithRabbit = await amqplib.connect('amqp://localhost')
    const channel = await connectionWithRabbit.createChannel()

    const exchange = 'topic_logs'
    await channel.assertExchange(exchange, 'topic', { durable: false })

    const messages = [
      { key: 'news.sports.football', msg: '⚽ Football match update!' },
      { key: 'news.sports.cricket', msg: '🏏 Cricket world cup news!' },
      { key: 'news.movies.action', msg: '🎬 New action movie released!' },
      { key: 'news.weather.india', msg: '🌤️ Weather forecast for India' },
      { key: 'news.weather.uk', msg: '🌧️ Rain alert for the UK' },
      { key: 'news.sports.tennis', msg: '🎾 Wimbledon results announced!' }
    ]

    for (const { key, msg } of messages) {
      channel.publish(exchange, key, Buffer.from(msg))
      console.log(`✅ Sent '${msg}' with key '${key}'`)
    }

    setTimeout(() => {
      connectionWithRabbit.close()
    }, 500)
  } catch (err) {
    console.log(`Error : ${err}`)
  }
}

connectAndSend()
