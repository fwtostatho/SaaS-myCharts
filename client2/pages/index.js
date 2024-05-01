import { useSession  } from "next-auth/react"
import { useRouter } from "next/router";
import React , {useState, useEffect} from 'react';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import AboutButton from "../components/aboutButton";
import ReturnButton from "../components/returnButton";
import Link from "next/link";


const indexPage = () => {
    const router = useRouter();
    const {data, status} = useSession();
    const [chartIndex, setChartIndex] = useState(0);
    const [modulesLoaded, setModulesLoaded] = useState(false);
    const [chartType, setChartType] = useState(null);


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
    }, []);
    const chartOptions1 = {
        chart:{
            type:'area'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }],

    }

    const chartOptions2 = {
        chart:{
            type:'line'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    }

    const chartOptions3 = {
        chart: {
            type: 'dependencywheel'
        },
        exporting: {
            enabled: false // Set to false to hide the menu
        },
        series: [{
            keys: ['from', 'to', 'weight'],
            data: [
                ['Brazil', 'Portugal', 5],
                ['Brazil', 'France', 1],
                ['Brazil', 'Spain', 1],
                ['Brazil', 'England', 1],
                ['Canada', 'Portugal', 1],
                ['Canada', 'France', 5],
                ['Canada', 'England', 1],
                ['Mexico', 'Portugal', 1],
                ['Mexico', 'France', 1],
                ['Mexico', 'Spain', 5],
                ['Mexico', 'England', 1],
                ['USA', 'Portugal', 1],
                ['USA', 'France', 1],
                ['USA', 'Spain', 1],
                ['USA', 'England', 5],
                ['Portugal', 'Angola', 2],
                ['Portugal', 'Senegal', 1],
                ['Portugal', 'Morocco', 1],
                ['Portugal', 'South Africa', 3],
                ['France', 'Angola', 1],
                ['France', 'Senegal', 3],
                ['France', 'Mali', 3],
                ['France', 'Morocco', 3],
                ['France', 'South Africa', 1],
                ['Spain', 'Senegal', 1],
                ['Spain', 'Morocco', 3],
                ['Spain', 'South Africa', 1],
                ['England', 'Angola', 1],
                ['England', 'Senegal', 1],
                ['England', 'Morocco', 2],
                ['England', 'South Africa', 7],
                ['South Africa', 'China', 5],
                ['South Africa', 'India', 1],
                ['South Africa', 'Japan', 3],
                ['Angola', 'China', 5],
                ['Angola', 'India', 1],
                ['Angola', 'Japan', 3],
                ['Senegal', 'China', 5],
                ['Senegal', 'India', 1],
                ['Senegal', 'Japan', 3],
                ['Mali', 'China', 5],
                ['Mali', 'India', 1],
                ['Mali', 'Japan', 3],
                ['Morocco', 'China', 5],
                ['Morocco', 'India', 1],
                ['Morocco', 'Japan', 3],
                ['Japan', 'Brazil', 1]
            ],
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
    };

    const handleChartChange = (chartType) => {
        setChartType(chartType);
    };

    //if (status === "authenticated") {
        return (
            <>
            <div>
                {/*<h1>Authorized</h1>*/}
                { chartType === "area" ? (
                    <>
                <div>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={chartOptions1}
                    />
                </div>
                    </>
                    ):
                    chartType === "line" ? (
                        <>
                        <div>
                            <HighchartsReact
                                highcharts={Highcharts}
                                options={chartOptions2}
                            />
                        </div>
                        </>
                ) : chartType === "dependencywheel" ? (
                            <div>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={chartOptions3}
                                />
                            </div>
                    ) :
                    (
                       <h1></h1>
                    )
                }
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        top: '200px',
                    }}
                >
                <button className='button' onClick={() => handleChartChange("area")}>Line with annotations Chart</button>
                <button className='button' onClick={() => handleChartChange("line")}>Basic Line Chart</button>
                <button className='button' onClick={() => handleChartChange("dependencywheel")}>
                    Dependency Wheel Chart
                </button>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        top: '300px',
                    }}
                >
                <p>
                    Press on a diagram type to see how this works, or{' '}
                    <Link href="/login" passHref legacyBehavior>
                        <a style={{ textDecoration: 'underline' }}>login with your google account</a>
                    </Link>
                    {' '}to start creating your diagram.
                </p>
                </div>
                <AboutButton />
            </div>
                </>
        );
    // } else {
    //     return (
    //         <div>
    //             <h1>Not Authorized</h1>
    //             <ReturnButton/>
    //         </div>
    //     );
    // }
};

export default indexPage;