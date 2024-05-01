import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import parseCSV from './parseCSV'; // Import the parseCSV function

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });
export const config = {
    api: {
        externalResolver: true,
        bodyParser: false,
    },
};

export default function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).end(); // Method Not Allowed
        return;
    }

    // Use the 'upload' middleware to process the file upload
    upload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred
            console.error('Multer error:', err);
            res.status(500).json({ error: 'Error uploading file' });
            return;
        } else if (err) {
            // An unknown error occurred
            console.error('Unknown error:', err);
            res.status(500).json({ error: 'Error uploading file' });
            return;
        }

        // File upload successful, process the file as needed
        const file = req.file; // Access the uploaded file
        console.log('Processing');

        // Ensure the file is in CSV format
        if (file.mimetype !== 'text/csv') {
            fs.unlinkSync(file.path); // Cleanup: remove the uploaded file
            res.status(400).json({ error: 'Invalid file format. Only CSV files are allowed.' });
            return;
        }

        // Parse the CSV file using parseCSV function
        parseCSV(file.path)
            .then((chartData) => {
                // Return the parsed CSV data or perform further processing
                res.status(200).json({ data: chartData });
            })
            .catch((error) => {
                // Handle any errors that occur during parsing
                res.status(500).json({ error: 'Failed to parse CSV file.' });
            });
    });
}
