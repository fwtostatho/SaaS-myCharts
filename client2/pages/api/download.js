import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const { index } = req.query;

    let filename;
    let filePath;

    // Determine the file to serve based on the index
    switch (index) {
        case '0':
            filename = 'annotations_template.csv';
            filePath = path.join(process.cwd(), 'uploads', 'annotations_template.csv');
            break;
        case '1':
            filename = 'basicLine_template.csv';
            filePath = path.join(process.cwd(), 'uploads', 'basicLine_template.csv');
            break;
        case '2':
            filename = 'wheel_template.csv';
            filePath = path.join(process.cwd(), 'uploads', 'wheel_template.csv');
            break;
        default:
            filename = 'template.csv';
            filePath = path.join(process.cwd(), 'uploads', 'template.csv');
            break;
    }

    const fileStream = fs.createReadStream(filePath);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    fileStream.pipe(res);
}
