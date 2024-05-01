const startEventBus = require('../eventBusService/eventBus');
const Credits = require('../models/credits');
const express = require('express');


let bus; // Event bus instance
const MICROSERVICE_ID = 'microservice-5'; // Replace with your microservice ID

// Function to establish the event bus connection
const connectToEventBus = async () => {
    try {
        // Initialize the event bus
        bus = await startEventBus();
        console.log('Event bus connected');

        // Subscribe to events related to credit changes
        bus.subscribeToEvent('exchangeName', 'creditSub', async (event) => {
            if (event.sourceMicroserviceId !== MICROSERVICE_ID) {

                try {
                    const oldUserCredits = await Credits.find(
                        { userEmail: event.userEmail }
                    );
                    console.log('Old user info:', oldUserCredits)
                    const newTotal=  oldUserCredits[0].total - event.sub;
                    if (newTotal>=0){
                        const newSub=0;

                        // Find and update the credit in your database or perform the necessary actions
                        const updatedCredits = await Credits.findOneAndUpdate(
                            {  userEmail : event.userEmail},
                            { $set: {total:newTotal, added:newSub} },
                            { new: true }
                        );
                        console.log('Updated credits:', updatedCredits)
                        await publishCreditChangedEvent(updatedCredits);
                        console.log('Credit added:', updatedCredits);
                    }else {
                        console.log('Insufficient credits ');

                    }

                } catch (error) {
                    console.error('Error updating credit:', error);
                }
            }
        });

        bus.subscribeToEvent('exchangeName', 'creditAdded', async (event) => {
            if (event.sourceMicroserviceId !== MICROSERVICE_ID) {

                try {
                    const oldUserCredits = await Credits.find(
                        { userEmail: event.userEmail }
                    );
                    console.log('Old user info:', oldUserCredits)
                    const newTotal=  oldUserCredits[0].total + event.added;
                    const newAdded=0;

                    // Find and update the credit in your database or perform the necessary actions
                    const updatedCredits = await Credits.findOneAndUpdate(
                        {  userEmail : event.userEmail},
                        { $set: {total:newTotal, added:newAdded} },
                        { new: true }
                    );
                    console.log('Updated credits:', updatedCredits)
                    await publishCreditChangedEvent(updatedCredits);
                    console.log('Credit added:', updatedCredits);
                } catch (error) {
                    console.error('Error updating credit:', error);
                }
            }
        });

        bus.subscribeToEvent('exchangeName', 'creditCreated', async (event) => {
            if (event.sourceMicroserviceId !== MICROSERVICE_ID) {

                const total=  event.added; //event.added?
                const added=0;
                const sub= event.sub;
                const userEmail= event.userEmail;

                try {
                    // Create a new credit in your database or perform the necessary actions
                    const newCredit = new Credits({ userEmail, total, sub, added });
                    const savedCredit = await newCredit.save();

                    console.log('Credit created:', savedCredit);
                    await publishCreditChangedEvent(savedCredit);
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
const publishCreditChangedEvent = async (credit) => {
    const { userEmail, total, sub, added } = credit;
    // Publish the credit changed event with the microservice ID
    bus.publishEvent('exchangeName', 'creditChanged', {
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
    publishCreditChangedEvent
};
