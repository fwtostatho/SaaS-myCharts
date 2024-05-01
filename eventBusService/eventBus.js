const amqp = require('amqplib');

async function startEventBus() {
    try {
        const connection = await amqp.connect('amqp://rabbitmq'); // Update the connection URL if needed
        const channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');

        return {
            publishEvent: async (exchange, routingKey, message) => {
                try {
                    await channel.assertExchange(exchange, 'topic', { durable: false });
                    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
                    console.log('Event published:', message);
                } catch (error) {
                    console.error('Error publishing event:', error);
                }
            },

            subscribeToEvent: async (exchange, routingKey, handler) => {
                try {
                    await channel.assertExchange(exchange, 'topic', { durable: false });
                    const queue = await channel.assertQueue('', { exclusive: true });
                    channel.bindQueue(queue.queue, exchange, routingKey);
                    channel.consume(queue.queue, (message) => {
                        const event = JSON.parse(message.content.toString());
                        handler(event);
                    }, { noAck: true });
                    console.log('Subscribed to event:', routingKey);
                } catch (error) {
                    console.error('Error subscribing to event:', error);

                }
            },

            close: async () => {
                try {
                    await channel.close();
                    await connection.close();
                    console.log('Disconnected from RabbitMQ');
                } catch (error) {
                    console.error('Error closing RabbitMQ connection:', error);
                }
            }
        };
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        console.log('Retrying connection to RabbitMQ in 5 seconds...');
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Retry by recursively calling the connectToRabbitMQWithRetry function
        return startEventBus();

    }
}

module.exports = startEventBus;
