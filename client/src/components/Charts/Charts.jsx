import React, {useEffect} from 'react';
import {Line} from 'react-chartjs-2';
import styles from './Charts.module.css';
import { formatDate, transformToDailyNewStats } from '../../MyUtil';


const Chart = ({timeSeries, countryPicked, rank}) => {

    useEffect(() => {
        console.log('Apply Chart side effect after DOM mount or update...');
        return () => console.log('Clean up Chart side effect before DOM unmount...');
    }, []);

    const transformedTimeSeries = transformToDailyNewStats(timeSeries);

    const confirmedChart = (
        timeSeries.length? 
                (<Line
                    data = {{
                        labels: timeSeries[0].date? transformedTimeSeries.map(({date}) => formatDate(date)) : transformedTimeSeries.map(({lastUpdate}) => formatDate(lastUpdate)),
                        datasets: [{
                            data: transformedTimeSeries.map(({confirmed}) => confirmed),
                            label: 'Confirmed',
                            borderColor: 'blue',
                            fill: true
                        }],
                    }}
                    options = {{
                        maintainAspectRatio: false,
                        title: {
                          display: true,
                          text: countryPicked + ' New Confirmed' + (countryPicked === 'Global'? '' : ', Rank = ') + rank,
                          fontSize: 20
                        },
                        legend: {
                          display: false,
                          position: 'right'
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    padding: 0,
                                    labelOffset: 0,
                                    callback: function(value, index, values) {
                                        if (index % 2 === 0) {
                                            return '';
                                        }
                                        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    },
                                }
                            }]
                        }
                      }}
                />) :  null
    );

    const deathsChart = (
        timeSeries.length? 
                (<Line
                    data = {{
                        labels: transformedTimeSeries[0].date? transformedTimeSeries.map(({date}) => formatDate(date)) : transformedTimeSeries.map(({lastUpdate}) => formatDate(lastUpdate)),
                        datasets: [{
                            data: transformedTimeSeries.map(({deaths}) => deaths),
                            label: 'Deaths',
                            borderColor: 'red',
                            fill: true
                        }],
                    }}
                    options = {{
                        maintainAspectRatio: false,
                        title: {
                          display: true,
                          text: countryPicked + ' New Deaths',
                          fontSize: 20
                        },
                        legend: {
                          display: false,
                          position: 'right'
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    padding: 0,
                                    labelOffset: 0,
                                    callback: function(value, index, values) {
                                        if (index % 2 === 0) {
                                            return '';
                                        }
                                        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    },
                                }
                            }]
                        }
                      }}
                />) :  null
    );

    const deathRateChart = (
        timeSeries.length? 
                (<Line
                    data = {{
                        labels: timeSeries[0].date? timeSeries.map(({date}) => formatDate(date)) : timeSeries.map(({lastUpdate}) => formatDate(lastUpdate)),
                        datasets: [{
                            data: timeSeries.map(({deaths, confirmed}) => (deaths / confirmed)),
                            label: 'Death Rate',
                            borderColor: 'red',
                            fill: true,
                        }],
                    }}
                    options = {{
                        maintainAspectRatio: false,
                        title: {
                          display: true,
                          text: countryPicked + ' Death Rate',
                          fontSize: 20
                        },
                        legend: {
                          display: false,
                          position: 'top'
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    padding: 0,
                                    labelOffset: 0,
                                    callback: function(value, index, values) {
                                        if (index % 2 === 0) {
                                            return '';
                                        }
                                        return (value * 100).toFixed(2) + '%';
                                    },
                                }
                            }]
                        }
                      }}
                />) :  null
    );

    const recoveryRateChart = (
        timeSeries.length? 
                (<Line
                    data = {{
                        labels: timeSeries[0].date? timeSeries.map(({date}) => formatDate(date)) : timeSeries.map(({lastUpdate}) => formatDate(lastUpdate)),
                        datasets: [{
                            data: timeSeries.map(({recovered, confirmed}) => (recovered / confirmed)),
                            label: 'Recovery Rate',
                            borderColor: 'green',
                            fill: true,
                        }],
                    }}
                    options = {{
                        maintainAspectRatio: false,
                        title: {
                          display: true,
                          text: countryPicked + ' Recovery Rate',
                          fontSize: 20
                        },
                        legend: {
                          display: false,
                          position: 'top'
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    padding: 0,
                                    labelOffset: 0,
                                    callback: function(value, index, values) {
                                        if (index % 2 === 0) {
                                            return '';
                                        }
                                        return (value * 100).toFixed(2) + '%';
                                    },
                                }
                            }]
                        }
                      }}
                />) :  null
    );

    return (
        <div className={styles.container}>
            <div className={styles.chart}>
                {confirmedChart}
            </div>
            <div className={styles.chart}>
                {deathsChart}
            </div>
            <div className={styles.chart}>
                {deathRateChart}
            </div>
            <div className={styles.chart}>
                {recoveryRateChart}
            </div>
        </div>
    )
}

export default Chart;