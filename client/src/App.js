import React from 'react';
import Cards from './components/Cards/Cards'
import Charts from './components/Charts/Charts'
import CountryPicker from './components/CountryPicker/CountryPicker'
import styles from './App.module.css';
import { fetchAllDailyStatsForMajorCountries, fetchDailyData, fetchData } from './api';

const majorCountries = ['US','Brazil', 'Russia', 'United Kingdom', 'Italy', 'France', 'Germany', 'Spain', 'Turkey', 'Iran', 'India', 'China', 'Korea; South', 'Japan'];

class App extends React.Component {

  state = {
    dailyGlobalStats: [],
    dailyStatsForMajorCountries: [],
    snapshotStats: {},
  }

  async componentDidMount() {
    this.setState({dailyGlobalStats: await fetchDailyData(), 
                    dailyStatsForMajorCountries: await fetchAllDailyStatsForMajorCountries(majorCountries), 
                    snapshotStats: await fetchData(),
                });
  }

  handleCountryChange = async (country) => {
    this.setState({snapshotStats: await fetchData(country)})
  }

  render() {
    const {dailyGlobalStats, dailyStatsForMajorCountries, snapshotStats} = this.state;

    return (
      <div className={styles.container}>
        <header>
          <h1>COVID-19 Global Daily Stats by Country</h1>
          <p>- Provided by Monad Technologies, 2020</p>
        </header>
        <Charts timeSeries={dailyGlobalStats} countryPicked='Global' />
        {dailyStatsForMajorCountries.map((dailyStats, i) => <Charts key={i} timeSeries={dailyStats} countryPicked={dailyStats[0].countryName}/>)}
        <CountryPicker handleCountryChange={this.handleCountryChange} />
        <Cards snapshotStats={snapshotStats} />
      </div>
    )
  }
}

export default App;
