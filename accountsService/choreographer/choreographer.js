const startEventBus = require('../eventBusService/eventBus');
const Credits = require('../models/credits');
const User = require('../models/user');

let bus; // Event bus instance
const MICROSERVICE_ID = 'microservice-1'; // Replace with your microservice ID

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

        bus.subscribeToEvent('exchangeName', 'userChanged', async (event) => {
            if (event.sourceMicroserviceId !== MICROSERVICE_ID) {
                const { username, userEmail, numOfCharts, lastLogin, currentLogin } = event;
                try {
                    // Find and update the credit in your database or perform the necessary actions
                    const updatedUser = await User.findOneAndUpdate(
                        { userEmail },
                        { username, numOfCharts, lastLogin, currentLogin },
                        { new: true }
                    );

                    console.log('User updated:', updatedUser);
                } catch (error) {
                    console.error('Error updating user:', error);
                }
            }
        });

        bus.subscribeToEvent('exchangeName', 'userCreated', async (event) => {
            if (event.sourceMicroserviceId !== MICROSERVICE_ID) {
                const { username, userEmail, numOfCharts, lastLogin, currentLogin  } = event;
                try {
                    // Create a new credit in your database or perform the necessary actions
                    const newUser = new User({ username, userEmail, numOfCharts, lastLogin, currentLogin  });
                    const savedUser = await newUser.save();

                    console.log('User created:', savedUser);
                } catch (error) {
                    console.error('Error creating user:', error);
                }
            }
        });

        console.log('Event bus setup completed');
    } catch (error) {
        console.error('Error connecting to event bus:', error);
    }
};

const publishUserChangedEvent = async (user) => {
    const {username, userEmail, numOfCharts, lastLogin, currentLogin } = user;
    // Publish the credit changed event with the microservice ID
    bus.publishEvent('exchangeName', 'userChanged', {
        username,
        userEmail,
        numOfCharts,
        lastLogin,
        currentLogin,
        sourceMicroserviceId: MICROSERVICE_ID,
    });
};

const publishUserCreatedEvent = async (user) => {
    const { username, userEmail, numOfCharts, lastLogin, currentLogin  } = user;
    // Publish the credit created event with the microservice ID
    bus.publishEvent('exchangeName', 'userCreated', {
        username,
        userEmail,
        numOfCharts,
        lastLogin,
        currentLogin,
        sourceMicroserviceId: MICROSERVICE_ID,
    });
};

// Call the connectToEventBus function to establish the event bus connection
connectToEventBus();

module.exports = {
    publishUserChangedEvent,
    publishUserCreatedEvent
};
