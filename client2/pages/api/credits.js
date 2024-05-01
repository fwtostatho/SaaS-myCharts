// pages/api/saveData.js
// import connectDB from '../../utils/connectDB';
//import DataModel from '../../../creditsService/models/credits.js';

// Connect to the MongoDB database
// connectDB();

export default async function handler(req, res) {


    if (req.method === 'GET' && req.query.query) {

        console.log('in get user method');


        try {
            const  userEmail = req.query.userEmail;
            console.log(`http://localhost:4002/credits/${userEmail}`);
            const response = await fetch(`http://creditsservice:4002/credits/${userEmail}`);
            console.log("MHPWS?? " + response.data)
            if (response.ok) {
                // Handle successful response
                const responseData = await response.json();
                console.log(responseData);
                res.status(200).json(responseData);
            } else {
                // Handle error response
                const errorData = await response.json();
                res.status(response.status).json(errorData);
            }

        }catch (error) {
            console.log("GAMIDI " + error)
            // Handle network or other error
            res.status(500).json({ error: 'Failed to send GET user email request' });
        }
    }else if (req.method === 'GET') {
        console.log('in get  method');
        try {
            const response = await fetch('http://creditsservice:4002/credits', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                // Handle successful response
                const responseData = await response.json();
                res.status(200).json(responseData);
            } else {
                // Handle error response
                const errorData = await response.json();
                res.status(response.status).json(errorData);
            }

        }catch (error) {
            // Handle network or other error
            res.status(500).json({ error: 'Failed to send GET request' });
        }
    }else if (req.method === 'PUT') {
        console.log('in put user method');
        try {
            const  data  = req.body;

            console.log(data +"!!!!");
            const response = await fetch('http://creditsservice:4002/credits', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                // Handle successful response
                const responseData = await response.json();
                res.status(200).json(responseData);
            } else {
                // Handle error response
                const errorData = await response.json();
                res.status(response.status).json(errorData);
            }

        }catch (error) {
            // Handle network or other error
            res.status(500).json({ error: 'Failed to send GET request' });
        }
    } else if (req.method === 'POST') {
        console.log('in post method');
        try {
            const { data } = req.body;

            console.log(data +"!!!!");

            const response = await fetch('http://creditsservice:4002/credits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                // Handle successful response
                const responseData = await response.json();
                res.status(200).json(responseData);
            } else {
                // Handle error response
                const errorData = await response.json();
                res.status(response.status).json(errorData);
            }
        } catch (error) {
            // Handle network or other error
            res.status(500).json({ error: 'Failed to send request' });
        }
    } else {
        res.status(400).json({ error: 'Invalid request method' });
    }
}
