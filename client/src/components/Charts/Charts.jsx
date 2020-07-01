import React, {useEffect} from 'react';
import {Line} from 'react-chartjs-2';
// @ts-ignore
import styles from './Charts.module.css';
import { formatDate, smoothTimeSeries, transformToDailyNewStats } from '../../MyUtil';


const Chart = ({timeSeries, countryPicked, rank}) => {

    useEffect(() => {
        console.log('Apply Chart side effect after DOM mount or update...');
        return () => console.log('Clean up Chart side effect before DOM unmount...');
    }, []);

    // timeSeries.forEach(({deaths, confirmed, recovered, lastUpdate}) => {
    //     console.log(countryPicked + ' timeSeries confirmed=' + confirmed + ', recovered=' + recovered + ', lastUpdate=' + lastUpdate)
    // });
    smoothTimeSeries(timeSeries);
    const transformedTimeSeries = transformToDailyNewStats(timeSeries);
    // transformedTimeSeries.forEach(({deaths, confirmed, recovered, lastUpdate}) => {
    //     console.log(countryPicked + ' transformedTimeSeries deaths=' + deaths + ', recovered=' + recovered + ', lastUpdate=' + lastUpdate)
    // });

    const confirmedChart = (
        timeSeries.length? 
                (<Line
                    data = {{
                        labels: timeSeries[0].date? transformedTimeSeries.map(({date}) => formatDate(date)) : transformedTimeSeries.map(({lastUpdate}) => formatDate(lastUpdate)),
                        datasets: [{
                            data: transformedTimeSeries.map(({confirmed}) => confirmed),
                            label: 'New Confirmed',
                            borderColor: 'blue',
                            fill: true
                        }],
                    }}
                    options = {{
                        maintainAspectRatio: false,
                        title: {
                          display: true,
                          text: '(' + countryPicked + ') New Confirmed' + (countryPicked === 'Global'? '' : ', Rank = ') + rank,
                          fontSize: 20
                        },
                        legend: {
                          display: false,
                          position: 'right'
                        },
                        scales: {
                            xAxes: [{
                                ticks: {
                                    padding: 0,
                                    labelOffset: 0,
                                    callback: function(value, index, values) {
                                        if (index % 2 === 1) {
                                            return '';
                                        }
                                        return value;
                                    },
                                }
                            }],
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
                            label: 'New Deaths',
                            borderColor: 'red',
                            fill: true
                        }],
                    }}
                    options = {{
                        maintainAspectRatio: false,
                        title: {
                          display: true,
                          text: 'New Deaths',
                          fontSize: 20
                        },
                        legend: {
                          display: false,
                          position: 'right'
                        },
                        scales: {
                            xAxes: [{
                                ticks: {
                                    padding: 0,
                                    labelOffset: 0,
                                    callback: function(value, index, values) {
                                        if (index % 2 === 1) {
                                            return '';
                                        }
                                        return value;
                                    },
                                }
                            }],
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

    const deathRateSeries = timeSeries.filter(({deaths, confirmed}) => (deaths / confirmed) < 0.5);
    const deathRateChart = (
        deathRateSeries.length? 
                (<Line
                    data = {{
                        labels: deathRateSeries[0].date? deathRateSeries.map(({date}) => formatDate(date)) : deathRateSeries.map(({lastUpdate}) => formatDate(lastUpdate)),
                        datasets: [{
                            data: deathRateSeries.map(({deaths, confirmed}) => (deaths / confirmed)),
                            label: 'Death Rate',
                            borderColor: 'red',
                            fill: true,
                        }],
                    }}
                    options = {{
                        maintainAspectRatio: false,
                        title: {
                          display: true,
                          text: 'Death Rate',
                          fontSize: 20
                        },
                        legend: {
                          display: false,
                          position: 'top'
                        },
                        scales: {
                            xAxes: [{
                                ticks: {
                                    callback: function(value, index, values) {
                                        if (index % 2 === 1) {
                                            return '';
                                        }
                                        return value;
                                    },
                                }
                            }],
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

    const recoverRateSeries = timeSeries.filter(({recovered, confirmed}) => (recovered / confirmed) > 0);
    const recoveryRateChart = (
        recoverRateSeries.length? 
                (<Line
                    data = {{
                        labels: recoverRateSeries[0].date? recoverRateSeries.map(({date}) => formatDate(date)) : recoverRateSeries.map(({lastUpdate}) => formatDate(lastUpdate)),
                        datasets: [{
                            data: recoverRateSeries.map(({recovered, confirmed}) => (recovered / confirmed)),
                            label: 'Recovery Rate',
                            borderColor: 'green',
                            fill: true,
                        }],
                    }}
                    options = {{
                        maintainAspectRatio: false,
                        title: {
                          display: true,
                          text: 'Recovery Rate',
                          fontSize: 20
                        },
                        legend: {
                          display: false,
                          position: 'top'
                        },
                        scales: {
                            xAxes: [{
                                ticks: {
                                    padding: 0,
                                    labelOffset: 0,
                                    callback: function(value, index, values) {
                                        if (index % 2 === 1) {
                                            return '';
                                        }
                                        return value;
                                    },
                                }
                            }],
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