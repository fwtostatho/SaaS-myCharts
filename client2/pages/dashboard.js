import React from 'react';

const Dashboard = ({ numberOfCharts, lastLoginTime, credits }) => {
    return (
        <div className="center">
            <div className="dashboard-stats">
                <div className="stat">
                    <h2>Number of Charts</h2>
                    <p>{numberOfCharts}</p>
                </div>
                <div className="stat">
                    <h2>Credits</h2>
                    <p>{credits}</p>
                </div>
                <div className="stat">
                    <h2>Last Login Time</h2>
                    <p>{lastLoginTime}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
