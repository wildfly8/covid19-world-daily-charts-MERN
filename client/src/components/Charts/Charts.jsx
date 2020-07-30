import React, {useEffect} from 'react';
import {Line} from 'react-chartjs-2';
// @ts-ignore
import styles from './Charts.module.css';
import { formatDate, smoothTimeSeries, transformToDailyNewStats } from '../../MyUtil';


const Chart = ({timeSeries, countryPicked, rank, isProvince}) => {

    useEffect(() => {
        console.log(`Apply Chart side effect only once after DOM mount...`);
        return () => {
            console.log(`Clean up existing Chart side-effect before next effect occurs...`);
        }
    }, []);

    // timeSeries.forEach(({deaths, confirmed, recovered, lastUpdate}) => {
    //     console.log(countryPicked + ' timeSeries confirmed=' + confirmed + ', recovered=' + recovered + ', lastUpdateType=' + typeof(lastUpdate) + ', lastUpdate=' + lastUpdate)
    // });
    smoothTimeSeries(timeSeries);
    const transformedTimeSeries = transformToDailyNewStats(timeSeries);
    // transformedTimeSeries.forEach(({deaths, confirmed, recovered, lastUpdate}) => {
    //     console.log(countryPicked + ' transformedTimeSeries deaths=' + deaths + ', recovered=' + recovered + ', lastUpdate=' + lastUpdate)
    // });

    const confirmedChart =  (
        transformedTimeSeries.length? 
                (<Line
                    data = {{
                        labels: transformedTimeSeries[0].date? transformedTimeSeries.map(({date}) => formatDate(date)) : transformedTimeSeries.map(({lastUpdate}) => formatDate(lastUpdate)),
                        datasets: [{
                            data: transformedTimeSeries.map(({confirmed}) => confirmed),
                            label: 'New Confirmed',
                            borderColor: 'blue',
                            pointRadius: 1,
                            fill: true,
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

    const deathsChart = isProvince? (
        transformedTimeSeries.length? 
                (<Line
                    data = {{
                        labels: transformedTimeSeries[0].date? transformedTimeSeries.map(({date}) => formatDate(date)) : transformedTimeSeries.map(({lastUpdate}) => formatDate(lastUpdate)),
                        datasets: [{
                            data: transformedTimeSeries.map(({deaths}) => deaths),
                            label: 'New Deaths',
                            borderColor: 'red',
                            pointRadius: 1,
                            fill: true,
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
                                        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    },
                                }
                            }]
                        }
                      }}
                />) :  null
    ) : (
        transformedTimeSeries.length? 
                (<Line
                    data = {{
                        labels: transformedTimeSeries[0].date? transformedTimeSeries.map(({date}) => formatDate(date)) : transformedTimeSeries.map(({lastUpdate}) => formatDate(lastUpdate)),
                        datasets: [{
                            data: transformedTimeSeries.map(({deaths}) => deaths),
                            label: 'New Deaths',
                            borderColor: 'red',
                            pointRadius: 1,
                            fill: true,
                        }, {
                            data: transformedTimeSeries.map(({otherDetails}) => otherDetails? otherDetails.onVentilatorCurrently : null),
                            label: 'Ventilator',
                            borderColor: 'pink',
                            pointRadius: 1,
                            fill: false,
                        }, {
                            data: transformedTimeSeries.map(({otherDetails}) => otherDetails? otherDetails.inIcuCurrently : null),
                            label: 'ICU',
                            borderColor: 'purple',
                            pointRadius: 1,
                            fill: false,
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
                          display: (transformedTimeSeries[transformedTimeSeries.length - 1].otherDetails && transformedTimeSeries[transformedTimeSeries.length - 1].otherDetails.inIcuCurrently)
                            || (transformedTimeSeries[transformedTimeSeries.length - 1].otherDetails && transformedTimeSeries[transformedTimeSeries.length - 1].otherDetails.onVentilatorCurrently),
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
                            pointRadius: 1,
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
                            pointRadius: 1,
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

    const hospitalizedChart =  (
        transformedTimeSeries.length? 
                (<Line
                    data = {{
                        labels: transformedTimeSeries[0].date? transformedTimeSeries.map(({date}) => formatDate(date)) : transformedTimeSeries.map(({lastUpdate}) => formatDate(lastUpdate)),
                        datasets: [{
                            data: transformedTimeSeries.map(({otherDetails}) => otherDetails? otherDetails.hospitalizedCurrently : null),
                            label: 'Hosptalized',
                            borderColor: 'black',
                            pointRadius: 1,
                            fill: true,
                        }, {
                            data: transformedTimeSeries.map(({otherDetails}) => otherDetails? otherDetails.onVentilatorCurrently : null),
                            label: 'Ventilator',
                            borderColor: 'pink',
                            pointRadius: 1,
                            fill: false,
                        }, {
                            data: transformedTimeSeries.map(({otherDetails}) => otherDetails? otherDetails.inIcuCurrently : null),
                            label: 'ICU',
                            borderColor: 'purple',
                            pointRadius: 1,
                            fill: false,
                        }],
                    }}
                    options = {{
                        maintainAspectRatio: false,
                        title: {
                          display: true,
                          text: 'Hosptalized',
                          fontSize: 20
                        },
                        legend: {
                          display: (transformedTimeSeries[transformedTimeSeries.length - 1].otherDetails && transformedTimeSeries[transformedTimeSeries.length - 1].otherDetails.inIcuCurrently)
                            || (transformedTimeSeries[transformedTimeSeries.length - 1].otherDetails && transformedTimeSeries[transformedTimeSeries.length - 1].otherDetails.onVentilatorCurrently),
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
                                        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    },
                                }
                            }]
                        }
                      }}
                />) :  null
    );

    return isProvince? (
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
                {hospitalizedChart}
            </div>
        </div>
    ) : (
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