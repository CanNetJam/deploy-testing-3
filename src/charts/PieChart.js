import React from "react"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS } from "chart.js/auto"
import ChartDataLabels from 'chartjs-plugin-datalabels'

function PieChart({ chartData }) {
    return <Pie data={chartData} plugins={[ChartDataLabels]} 
    options= {{
        plugins: {
          datalabels: {
            color: 'white',
            font: {
                weight: 'bold',
                size: 24
            }
          }
        }
    }}
    />
}

export default PieChart