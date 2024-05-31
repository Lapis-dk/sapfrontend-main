import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import './graph.css'; // Import the CSS file

import {CategoryScale} from 'chart.js'; 
import Chart from 'chart.js/auto';
Chart.register(CategoryScale);


const Graph = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/getdata', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                });
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container">
            <div className="chart-container">
                <h2>Data Display</h2>
                {data ? (
                    <Bar
                        data={{
                            labels: data.labels,
                            datasets: [
                                {
                                    label: 'Values',
                                    backgroundColor: 'rgba(75,192,192,0.2)',
                                    borderColor: 'rgba(75,192,192,1)',
                                    borderWidth: 1,
                                    hoverBackgroundColor: 'rgba(75,192,192,0.4)',
                                    hoverBorderColor: 'rgba(75,192,192,1)',
                                    data: data.values
                                }
                            ]
                        }}
                        options={{
                            maintainAspectRatio: false,
                            scales: {
                                yAxes: [
                                    {
                                        ticks: {
                                            beginAtZero: true
                                        }
                                    }
                                ]
                            }
                        }}
                        height={400} // Adjust the height as needed
                    />
                ) : (
                    <p>Loading data...</p>
                )}
            </div>
        </div>
    );
};

export default Graph;