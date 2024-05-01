const startEventBus = require('../eventBusService/eventBus');   //!!!!
const Credits = require('../models/credits');

let bus; // Event bus instance
const MICROSERVICE_ID = 'microservice-3'; // Replace with your microservice ID

// Function to establish the event bus connection
const connectToEventBus = async () => {
    try {
        // Initialize the event bus
        bus = await startEventBus();
        console.log('Event bus connected');

        // Subscribe to events related to credit changes
        bus.subscribeToEvent('exchangeName', 'creditChanged', async (event) => {
            if (event.sourceMicroserviceId !== MICROSERVICE_ID) {
                const { userEmail, total, sub, added } = event;
                try {
                    // Find and update the credit in your database or perform the necessary actions
                    const updatedCredits = await Credits.findOneAndUpdate(
                        { userEmail },
                        { total, sub, added },
                        { new: true }
                    );

                    console.log('Credit updated:', updatedCredits);
                } catch (error) {
                    console.error('Error updating credit:', error);
                }
            }
        });

        bus.subscribeToEvent('exchangeName', 'creditCreated', async (event) => {
            if (event.sourceMicroserviceId !== MICROSERVICE_ID) {
                const { userEmail, total, sub, added } = event;
                try {
                    // Create a new credit in your database or perform the necessary actions
                    const newCredit = new Credits({ userEmail, total, sub, added });
                    const savedCredit = await newCredit.save();

                    console.log('Credit created:', savedCredit);
                } catch (error) {
                    console.error('Error creating credit:', error);
                }
            }
        });

        console.log('Event bus setup completed');
    } catch (error) {
        console.error('Error connecting to event bus:', error);
    }
};

// Function to publish credit changed event
const publishCreditAddedEvent = async (credit) => {
    const { userEmail, added } = credit;
    // Publish the credit changed event with the microservice ID
    bus.publishEvent('exchangeName', 'creditAdded', {
        userEmail,
        added,
        sourceMicroserviceId: MICROSERVICE_ID,
    });
};

// Function to publish credit created event
const publishCreditCreatedEvent = async (credit) => {
    const { userEmail, total, sub, added } = credit;
    // Publish the credit created event with the microservice ID
    bus.publishEvent('exchangeName', 'creditCreated', {
        userEmail,
        total,
        sub,
        added,
        sourceMicroserviceId: MICROSERVICE_ID,
    });
};

// Call the connectToEventBus function to establish the event bus connection
connectToEventBus();

module.exports = {
    publishCreditAddedEvent,
    publishCreditCreatedEvent,
};
