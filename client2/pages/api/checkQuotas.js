import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            console.log('IN CHECKQUOTAS')
            const chartData = req.body.data;
            const mail = req.body.userEmail;
            console.log('Chart data', chartData)
            const chartType = chartData.chart.type;
            let chartCost
            if (chartType === 'line'){
                chartCost = 5;
            }
            else if (chartType === 'area'){
                chartCost = 10;
            }
            else chartCost = 15;


            const userCredits =await axios.get(`http://createchartservice:4001/credits/${mail}`);
            console.log(userCredits.data[0])
            if ((userCredits.data[0].total - chartCost) < 0){
                console.log(userCredits.data[0].total - chartCost);
                res.status(400).json({ error: 'Insufficient credits' });

            }else{
                res.status(200).json({ message: 'Data sent successfully' });
            }

        } catch (error) {
            console.error('Error sending data:', error);
            res.status(500).json({ error: 'Failed to send data' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
