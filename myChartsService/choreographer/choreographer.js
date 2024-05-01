const startEventBus = require('../eventBusService/eventBus');
const User = require('../models/user');
const Chart = require('../models/chart');


let bus; // Event bus instance
const MICROSERVICE_ID = 'microservice-6'; // Replace with your microservice ID

// Function to establish the event bus connection
const connectToEventBus = async () => {
    console.log('Connecting to event bus')
    try {
        // Initialize the event bus
        bus = await startEventBus();
        console.log('Event bus connected');


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

        bus.subscribeToEvent('exchangeName', 'chartCreated', async (event) => {
            if (event.sourceMicroserviceId !== MICROSERVICE_ID) {
                const { type, cost, chartName, createdOn, userEmail, form  } = event;
                try {
                    // Create a new credit in your database or perform the necessary actions
                    const newChart = new Chart({ type, cost, chartName, createdOn, userEmail, form  });
                    const savedChart = await newChart.save();

                    const user = await User.find(
                        { userEmail: event.userEmail }
                    );
                    console.log('Old user numOfCharts:', user[0].numOfCharts)
                    const newNumOfCharts=  user[0].numOfCharts + 1;

                    // Find and update the credit in your database or perform the necessary actions
                    const updatedUser = await User.findOneAndUpdate(
                        {  userEmail : event.userEmail},
                        { $set: {numOfCharts: newNumOfCharts} },
                        { new: true }
                    );
                    console.log('Updated user:', updatedUser);

                    await publishUserChangedEvent(updatedUser);

                    console.log('Chart created:', savedChart);
                } catch (error) {
                    console.error('Error creating chart:', error);
                }
            }
        });

        console.log('Event bus setup completed');
    } catch (error) {
        console.error('Error connecting to event bus:', error);
    }
};

const publishChartCreatedEvent = async (chart) => {
    const { type, cost, chartName, createdOn, userEmail, form } = chart;
    // Publish the credit created event with the microservice ID
    bus.publishEvent('exchangeName', 'chartCreated', {
        type,
        cost,
        chartName,
        createdOn,
        userEmail,
        form,
        sourceMicroserviceId: MICROSERVICE_ID,
    });
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

// Call the connectToEventBus function to establish the event bus connection
connectToEventBus();

module.exports = {
    publishChartCreatedEvent
};
