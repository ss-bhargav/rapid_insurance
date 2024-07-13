import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function BarChart(props) {
  const [revenue, setRevenue] = useState([]);
  useEffect(() => {}, []);

  const data = {
    labels: ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'],
    datasets: [
      {
        // label: props.title,
        // data: props.lifeData,
        // backgroundColor: props.bg,
        borderWidth: 1,
        barPercentage: 0.5,
      },
    ],
  };
  const options = {
    legend: {
      labels: {
        fontColor: 'black',
      },
    },
    title: {
      display: true,
      fontColor: 'black',
      text: props.title,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            fontColor: 'black',
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            fontColor: 'black',
          },
        },
      ],
    },
  };

  return <Bar data={data} options={options} />;
}

export default BarChart;
