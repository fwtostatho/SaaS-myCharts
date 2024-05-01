import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const data = req.body.data;
            const mail = req.body.userEmail;
            const parsedData = JSON.parse(data);
            const chartType = parsedData.chart.type;
            let chartCost
            if (chartType === 'line'){
                chartCost = 5;
            }
            else if (chartType === 'area'){
                chartCost = 10;
            }
            else chartCost = 15;
            const payload = {
                type: parsedData.chart.type,
                cost: chartCost,
                chartName: parsedData.title.text,
                createdOn: new Date().toISOString(),
                userEmail: mail,
                form: parsedData
            };

                // Send parsedData to the localhost server using axios.post
                const response = await axios.post('http://createchartservice:4001/chart', payload);
                console.log(response.data);
                // Handle the response from the localhost server
                res.status(200).json({ message: 'Data sent successfully' });


        } catch (error) {
            console.error('Error sending data:', error);
            res.status(500).json({ error: 'Failed to send data' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
