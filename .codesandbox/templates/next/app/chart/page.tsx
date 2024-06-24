
'use client';
import * as fabric from '../../../../../fabric';
import { NextPage } from 'next';
import { useRef, useCallback } from 'react';
import { Canvas } from '../../components/Canvas';
// import { Utils } from 'chart.js';
import { ChartConfiguration } from 'chart.js';
import { XChart } from '../../../../../fabric';
const barChartConfig: ChartConfiguration = {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#000',
                    font: {
                        size: 24
                    }
                }
            },
            x: {
                ticks: {
                    color: '#000',
                    font: {
                        size: 24
                    }
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#000',
                    font: {
                        size: 24
                    }
                }
            }
        }
    }
};

const lineChartConfig: ChartConfiguration = {
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Sales',
                data: [65, 59, 80, 81, 56, 55],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    },
    options: {
        scales: {
            y: {
                ticks: {
                    color: '#000',
                    font: {
                        size: 24
                    }
                }
            },
            x: {
                ticks: {
                    color: '#000',
                    font: {
                        size: 24
                    }
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#000',
                    font: {
                        size: 24
                    }
                }
            }
        }
    }
};

const pieChartConfig: ChartConfiguration = {
    type: 'pie',
    data: {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
            {
                label: 'Votes',
                data: [300, 50, 100],
                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                borderWidth: 1
            }
        ]
    },
    options: {
        plugins: {
            legend: {
                labels: {
                    color: '#000',
                    font: {
                        size: 24
                    }
                }
            }
        }
    }
};

const doughnutChartConfig: ChartConfiguration = {
    type: 'doughnut',
    data: {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
            {
                label: 'Votes',
                data: [300, 50, 100],
                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                borderWidth: 1
            }
        ]
    },
    options: {
        plugins: {
            legend: {
                labels: {
                    color: '#000',
                    font: {
                        size: 24
                    }
                }
            }
        }
    }
};

const radarChartConfig: ChartConfiguration = {
    type: 'radar',
    data: {
        labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
        datasets: [
            {
                label: 'My First Dataset',
                data: [65, 59, 90, 81, 56, 55, 40],
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)'
            },
            {
                label: 'My Second Dataset',
                data: [28, 48, 40, 19, 96, 27, 100],
                fill: true,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgb(54, 162, 235)',
                pointBackgroundColor: 'rgb(54, 162, 235)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(54, 162, 235)'
            }
        ]
    },
    options: {
        scales: {
            r: {
                angleLines: {
                    color: '#000'
                },
                grid: {
                    color: '#000'
                },
                pointLabels: {
                    color: '#000',
                    font: {
                        size: 24
                    }
                },
                ticks: {
                    color: '#000',
                    backdropColor: '#fff',
                    font: {
                        size: 24
                    }
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#000',
                    font: {
                        size: 24
                    }
                }
            }
        }
    }
};

const polarAreaChartConfig: ChartConfiguration = {
    type: 'polarArea',
    data: {
        labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
        datasets: [
            {
                label: 'My First Dataset',
                data: [11, 16, 7, 3, 14],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(201, 203, 207, 0.6)',
                    'rgba(54, 162, 235, 0.6)'
                ]
            }
        ]
    },
    options: {
        plugins: {
            legend: {
                labels: {
                    color: '#000',
                    font: {
                        size: 24
                    }
                }
            }
        }
    }
};

const bubbleChartConfig: ChartConfiguration = {
    type: 'bubble',
    data: {
        datasets: [
            {
                label: 'First Dataset',
                data: [
                    { x: 20, y: 30, r: 15 },
                    { x: 40, y: 10, r: 10 }
                ],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgb(255, 99, 132)'
            }
        ]
    },
    options: {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                ticks: {
                    color: '#000',
                    font: {
                        size: 24
                    }
                }
            },
            y: {
                ticks: {
                    color: '#000',
                    font: {
                        size: 24
                    }
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#000',
                    font: {
                        size: 24
                    }
                }
            }
        }
    }
};



const IndexPage: NextPage = () => {
    const ref = useRef<fabric.XCanvas>(null);

    const onLoad = useCallback(
        (canvas: fabric.XCanvas) => {
            canvas.setDimensions({
                width: document.documentElement.clientWidth
                ,
                height: document.documentElement.clientHeight
                    - 60,
            });

            const barChart = new XChart({ chartConfig: barChartConfig, width: 400, height: 400 });
            const lineChart = new XChart({ chartConfig: lineChartConfig, width: 400, height: 400 });
            const pieChart = new XChart({ chartConfig: pieChartConfig, width: 400, height: 400 });
            const doughnutChart = new XChart({ chartConfig: doughnutChartConfig, width: 400, height: 400 });
            const radarChart = new XChart({ chartConfig: radarChartConfig, width: 400, height: 400 });
            const polarAreaChart = new XChart({ chartConfig: polarAreaChartConfig, width: 400, height: 400 });
            const bubbleChart = new XChart({ chartConfig: bubbleChartConfig, width: 400, height: 400 });

            canvas.add(barChart);
            canvas.add(lineChart);
            canvas.add(pieChart);
            canvas.add(doughnutChart);
            canvas.add(radarChart);
            canvas.add(polarAreaChart);
            canvas.add(bubbleChart);

            // Positioning charts for better visualization
            barChart.set({ left: 50, top: 50 });
            lineChart.set({ left: 500, top: 50 });
            pieChart.set({ left: 50, top: 500 });
            doughnutChart.set({ left: 500, top: 500 });
            radarChart.set({ left: 50, top: 950 });
            polarAreaChart.set({ left: 500, top: 950 });
            bubbleChart.set({ left: 950, top: 50 });

            canvas.renderAll();

            // // Example of updating the chart
            // setTimeout(() => {
            //     const newConfig = { ...chartConfig };
            //     newConfig.data.datasets[0].data = [5, 10, 15, 20, 25, 30];
            //     chartObject.updateChart(newConfig);
            // }, 3000);

        },
        [ref]
    );

    return (
        <div className="position-relative">
            <Canvas ref={ref} onLoad={onLoad} />
        </div>
    );
};

export default IndexPage;
