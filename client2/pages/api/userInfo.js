// pages/api/saveData.js
// import connectDB from '../../utils/connectDB';
//import DataModel from '../../../creditsService/models/credits.js';

// Connect to the MongoDB database
// connectDB();

import axios from "axios";

export default async function handler(req, res) {

    if (req.method === 'GET' && req.query.query) {
        try {
            const  mail = req.query.userEmail;

            const userCredits =await axios.get(`http://accountsservice:4000/credits/${mail}`);
            console.log("in userInfo api userCredits", userCredits.data[0]);
            res.status(200).json(userCredits.data[0]);

        } catch (error) {
            // Handle network or other error
            res.status(500).json({ error: 'Failed to send request' });
        }
    } else if (req.method === 'GET') {
        try {
            const  mail = req.query.userEmail;

            const userInfo =await axios.get(`http://accountsservice:4000/user/${mail}`);
            console.log("in userInfo api userInfo", userInfo.data[0]);
            console.log(userInfo.data[0]);
            res.status(200).json(userInfo.data[0]);

        } catch (error) {
            // Handle network or other error
            res.status(500).json({ error: 'Failed to send request' });
        }
    } else {
        res.status(400).json({ error: 'Invalid request method' });
    }
}
