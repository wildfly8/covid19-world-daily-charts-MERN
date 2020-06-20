import React from 'react';
import Charts from './components/Charts/Charts'
//import Cards from './components/Cards/Cards'
//import CountryPicker from './components/CountryPicker/CountryPicker'
import styles from './App.module.css';
import { fetchAllDailyStatsForMajorCountries, fetchDailyData, fetchData } from './api';
import CountryCheckbox from './components/CountryCheckbox/CountryCheckbox';

const majorCountries = ['US', 'Canada', 'Mexico', 'Brazil', 'United Kingdom', 'Italy', 'France', 'Germany', 
                        'Russia', 'Iran', 'India', 'China', 'Korea; South', 'Japan', 'Australia'];

class App extends React.Component {

  state = {
    dailyGlobalStats: [],
    dailyStatsForMajorCountries: [],
    snapshotStats: {},
    counter: '',
  }

  async componentDidMount() {
    const {allDailyStats, visitsCounter} = await fetchAllDailyStatsForMajorCountries(majorCountries);
    this.setState({dailyGlobalStats: await fetchDailyData(), 
                    dailyStatsForMajorCountries: allDailyStats, 
                    snapshotStats: await fetchData(),
                    counter: visitsCounter,
                });
  }

  handleCountryChange = async (country) => {
    this.setState({snapshotStats: await fetchData(country)})
  }

  render() {
    const {dailyGlobalStats, dailyStatsForMajorCountries, snapshotStats, counter} = this.state;

    return (
      <div>
        <header>
          <h1>COVID-19 Global Daily Stats by Country</h1>
        </header>
        <div className={styles.container}>
          <div className={styles.nav}>
            Countries Selected:
            <CountryCheckbox checkboxLabel={'USA'} checked={true} handleCountryChange={this.handleCountryChange} />
          </div>
          <div className={styles.charts}>
            <Charts timeSeries={dailyGlobalStats} countryPicked='Global' />
            {dailyStatsForMajorCountries.map((dailyStats, i) => <Charts key={i} timeSeries={dailyStats} countryPicked={dailyStats[0]? dailyStats[0].countryName : ''}/>)}
            {/* <CountryPicker handleCountryChange={this.handleCountryChange} />
            <Cards snapshotStats={snapshotStats} /> */}
          </div>
        </div>
        <footer>
          <p>Visitors: {counter}</p>
          Provided by Monad Wisdom Technologies, 2020. If any suggestion, please email us at: wisdomspringtech@yahoo.com
        </footer>
      </div>
    )
  }
}

export default App;
