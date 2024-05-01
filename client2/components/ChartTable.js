import React from 'react';

const ChartTable = ({ charts, handleClick, downloadChartAsHTML,downloadChartAsSVG, downloadChartAsPDF, downloadChartAsPNG }) => {

    return (
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Created On</th>
                <th>User Email</th>
                <th>Download</th>
            </tr>
            </thead>
            <tbody>
            {charts.map((chart) => (
                <tr key={chart._id}>
                    <td>
                        <button className='button' onClick={() => handleClick(chart)}>
                            {chart.chartName}
                        </button>
                    </td>
                    <td>
                        {chart.type === 'area' && 'Line with annotations'}
                        {chart.type === 'line' && 'Basic Line'}
                        {chart.type === 'dependencywheel' && 'Dependency Wheel'}
                    </td>
                    <td>{chart.createdOn}</td>
                    <td>{chart.userEmail}</td>
                    <td>
                        <button className='button' onClick={() => downloadChartAsPNG(chart)}>PNG</button>
                        <button className='button' onClick={() => downloadChartAsPDF(chart)}>PDF</button>
                        <button className='button' onClick={() => downloadChartAsSVG(chart)}>SVG</button>
                        <button className='button' onClick={() => downloadChartAsHTML(chart)}>HTML</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};


export default ChartTable;
