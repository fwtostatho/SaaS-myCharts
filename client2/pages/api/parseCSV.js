import fs from 'fs';
import csv from 'csv-parser';

export default function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const chartData = {
            title: {
                text: ''
            },
            chart: {
                type: ''
            },
            xAxis: {
                categories: []
            },
            plotOptions: {
                series: {
                    animation: false
                }
            },
            exporting: {
                enabled: false // Set to false to hide the menu
            },
            series: [{
                name: '',
                data: []
            }]
        };
        const wheelData ={
            title: {
                text: ''
            },
            chart: {
                type: 'dependencywheel'
            },
                exporting: {
                    enabled: false // Set to false to hide the menu
                },
            series: [{
                keys: ['from', 'to', 'weight'],
                data: [],
                name: 'Dependency wheel series',
                dataLabels: {
                    color: '#333',
                    style: {
                        textOutline: 'none'
                    },
                    textPath: {
                        enabled: true
                    },
                    distance: 10
                },
                size: '95%'
            }]
        }

        let isFirstRow = true;
        let categoriesLength = 0;
        let dataLength = 0;
        let fromLength= 0;
        let toLength = 0;
        let weightLength = 0;

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                if (isFirstRow) {
                    const columnNames = Object.keys(row);
                    const typeColumn = columnNames.find((column) => column.toLowerCase().includes('type'));
                    const titleColumn = columnNames.find((column) => column === 'chartTitle');
                    const axisName = columnNames.find((column) => column === 'xAxisName');
                    if (typeColumn) {
                        chartData.chart.type = row[typeColumn].trim();
                    }
                    if (titleColumn) {
                        chartData.title.text = row[titleColumn].trim();
                    }
                    if (axisName) {
                        chartData.series[0].name = row[axisName].trim();
                    }
                    isFirstRow = false;
                }

                if (chartData.chart.type === 'dependencywheel') {
                    wheelData.title.text = chartData.title.text
                    const wheelDataItem = [row.from, row.to, parseFloat(row.weight)];
                    wheelData.series[0].data.push(wheelDataItem);
                    if (row.from.trim() !== ''){
                        fromLength++;
                    }
                    if (row.to.trim() !== ''){
                        toLength++;
                    }
                    if (row.weight.trim() !== ''){
                        weightLength++;
                    }
                }
                else {
                    chartData.xAxis.categories.push(row.xAxis);
                    chartData.series[0].data.push(parseFloat(row.data));

                    if (row.xAxis.trim() !== '') {
                        categoriesLength++;
                    }
                    if (row.data.trim() !== '') {
                        dataLength++;
                    }
                }
            })
            .on('end', () => {
                if (chartData.chart.type !== 'dependencywheel') {
                    if (categoriesLength !== dataLength) {
                        const modChartData = {error: 'CANNOT PREPARE YOUR CHART, YOUR UPLOADED FILE CONTAINS ERROR.'};
                        resolve(modChartData)
                    } else {
                        resolve(chartData);
                    }
                } else {
                    if (fromLength !== toLength && toLength !== weightLength) {
                        const modChartData = {error: 'CANNOT PREPARE YOUR CHART, YOUR UPLOADED FILE CONTAINS ERROR.'};
                        resolve(modChartData)
                    } else {
                        resolve(wheelData);
                    }
                }
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}
