import React from 'react';
import Cards from './components/Cards/Cards'
import Charts from './components/Charts/Charts'
import CountryPicker from './components/CountryPicker/CountryPicker'
import styles from './App.module.css';
import { fetchAllDailyStatsForMajorCountries, fetchDailyData, fetchData } from './api';

const majorCountries = ['US', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Colombia', 'United Kingdom', 'Italy', 
                        'France', 'Germany', 'Spain', 'Russia', 'Ukraine', 'Hungary', 'Poland', 'Israel', 'Turkey', 
                        'Iraq', 'Iran', 'India', 'Pakistan', 'South Africa', 'Singapore', 'Thailand', 'China', 
                        'Korea; South', 'Japan', 'Australia'];

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
        </header>
        <Charts timeSeries={dailyGlobalStats} countryPicked='Global' />
        {dailyStatsForMajorCountries.map((dailyStats, i) => <Charts key={i} timeSeries={dailyStats} countryPicked={dailyStats[0]? dailyStats[0].countryName : ''}/>)}
        <CountryPicker handleCountryChange={this.handleCountryChange} />
        <Cards snapshotStats={snapshotStats} />
        <footer>
          Provided by Monad Wisdom Technologies, 2020. If any suggestion, please email us at: wisdomspringtech@yahoo.com
        </footer>
      </div>
    )
  }
}

export default App;
