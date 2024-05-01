import React, {useEffect, useRef, useState} from 'react';
import { useSession  } from "next-auth/react"
import { useRouter } from "next/router";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import ChartTable from '../components/ChartTable';
import ReturnButton from "../components/returnButton";
import AboutButton from "../components/aboutButton";
import IndexButton from "../components/indexButton";

const ChartsPage = () => {
    const chartRef = useRef(null);
    const router = useRouter();
    const [charts, setCharts] = useState([]);
    const {data, status} = useSession();
    const [parsedData, setParsedData] = useState(null);
    const [chartVisible, setChartVisible] = useState(false);
    const [chartWheel, setChartWheel] = useState(false);
    const [modulesLoaded, setModulesLoaded] = useState(false);


    useEffect(() => {
        Promise.all([
            import('highcharts/modules/exporting'),
            import('highcharts/modules/sankey'),
            import('highcharts/modules/dependency-wheel'),
        ]).then(([ExportingModule, SankeyModule, WheelModule]) => {
            ExportingModule.default(Highcharts);
            SankeyModule.default(Highcharts);
            WheelModule.default(Highcharts);
            setModulesLoaded(true);
        });

        const fetchCharts = async () => {
            try {
                const userEmail = data.user.email; // Replace with the actual user's email
                console.log(userEmail);
                const response = await axios.get(`http://localhost:4005/chart/${userEmail}`);
                console.log(response);
                const fetchedCharts = response.data;

                setCharts(fetchedCharts);
            } catch (error) {
                console.error('Error retrieving index:', error);
            }
        };

        if (status === 'authenticated') {
            fetchCharts();
        }
    }, [data, status]);

    if (status === 'authenticated') {
        const handleClick = (chart) => {
            console.log(`Chart ID ${chart._id} clicked`);
            console.log(chart.form);
            setParsedData(chart.form);
            setChartVisible(true);
            if (chart.type === 'dependencywheel') {
                setChartWheel(true);
            } else {
                setChartWheel(false);
            }
        };
        const downloadChartAsPNG = (chart) => {
            setChartVisible(false);
            const chartData = chart.form;
            setParsedData(chartData);
            if (chart.type === 'dependencywheel') {
                setChartWheel(true);
            } else {
                setChartWheel(false);
            }
            setTimeout(() => {
                downloadPNG();
            }, 10);
        };
        const downloadPNG = () => {
            const chart = chartRef.current.chart;
            chart.exportChart({
                type: 'image/png',
                filename: 'chart',
                options: {
                    chart: {
                        backgroundColor: '#FFFFFF'
                    }
                }
            });
        };
        const downloadChartAsPDF = (chart) => {
            setChartVisible(false);
            const chartData = chart.form;
            setParsedData(chartData);
            if (chart.type === 'dependencywheel') {
                setChartWheel(true);
            } else {
                setChartWheel(false);
            }
            setTimeout(() => {
                downloadPDF();
            }, 10);
        };
        const downloadPDF = () => {
            const chart = chartRef.current.chart;
            chart.exportChart({
                type: 'application/pdf',
                filename: 'chart',
                options: {
                    chart: {
                        backgroundColor: '#FFFFFF'
                    }
                }
            });
        };
        const downloadChartAsSVG = (chart) => {
            setChartVisible(false);
            const chartData = chart.form;
            setParsedData(chartData);
            if (chart.type === 'dependencywheel') {
                setChartWheel(true);
            } else {
                setChartWheel(false);
            }
            setTimeout(() => {
                downloadSVG();
            }, 10);
        };
        const downloadSVG = () => {
            const chart = chartRef.current.chart;
            const svg = chart.getSVG();

            const downloadLink = document.createElement('a');
            downloadLink.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
            downloadLink.download = 'chart.svg';
            downloadLink.click();
        };
        const downloadChartAsHTML = (chart) => {
            setChartVisible(false);
            const chartData = chart.form;
            setParsedData(chartData);
            if (chart.type === 'dependencywheel') {
                setChartWheel(true);
            } else {
                setChartWheel(false);
            }
            setTimeout(() => {
                downloadHTML();
            }, 10);
        };
        const downloadHTML = () => {
            const chart = chartRef.current.chart;
            const chartContainer = chart.container;

            const htmlContent = chartContainer.innerHTML;
            const htmlTemplate = `<html><body>${htmlContent}</body></html>`;

            const downloadLink = document.createElement('a');
            downloadLink.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlTemplate);
            downloadLink.download = 'chart.html';
            downloadLink.click();
        };

        return (
            <>
                <div>
                    <h1>My Charts</h1>
                    <h3> {data.user.email}</h3>
                    {charts.length > 0 ? (
                        <ChartTable charts={charts} handleClick={handleClick} downloadChartAsPNG={downloadChartAsPNG}
                                    downloadChartAsPDF={downloadChartAsPDF} downloadChartAsSVG={downloadChartAsSVG}
                                    downloadChartAsHTML={downloadChartAsHTML}/>
                    ) : (
                        <p>No charts found.</p>
                    )}
                </div>
                <div>
                    {parsedData && !chartVisible && !chartWheel && (
                        <>
                            <div style={{ display: 'none' }}>
                                <HighchartsReact highcharts={Highcharts} options={parsedData} ref={chartRef} />
                            </div>
                            <p>Select chart preview</p>
                        </>
                    )}

                    {parsedData && !chartVisible && chartWheel &&  (
                        <>
                            <div style={{ display: 'none' }}>
                                <HighchartsReact highcharts={Highcharts} options={parsedData} ref={chartRef} />
                            </div>
                            <p>Select chart preview</p>
                        </>
                    )}

                    {parsedData && chartVisible && !chartWheel && (
                        <div style={{ margin: '0 auto', maxWidth: '50%' }}>
                            <HighchartsReact highcharts={Highcharts} options={parsedData} ref={chartRef} />
                        </div>
                    )}

                    {parsedData && chartVisible && chartWheel && (
                        <div style={{ margin: '0 auto', maxWidth: '50%' }}>
                            <HighchartsReact highcharts={Highcharts} options={parsedData} ref={chartRef} />
                        </div>
                    )}

                    {!parsedData && <p>Select chart preview</p>}
                </div>
                <ReturnButton/>
                <AboutButton/>
            </>
        );
    } else {
        return (<div>
            <h1>Not authorized</h1>
            <IndexButton/>
            <AboutButton/>
        </div>)
    }
};


export default ChartsPage;
