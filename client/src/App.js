import React from 'react';
import Charts from './components/Charts/Charts'
//import Cards from './components/Cards/Cards'
//import CountryPicker from './components/CountryPicker/CountryPicker'
import styles from './App.module.css';
import { fetchAllDailyStatsForMajorCountries, fetchAllDailyStatsForCountries, fetchDailyData } from './api';
import CountryCheckbox from './components/CountryCheckbox/CountryCheckbox';


class App extends React.Component {

  state = {
    topCountries: [],
    interestedCoutries: [],
    dailyGlobalStats: [],
    dailyStatsForCountries: [],
    //snapshotStats: {},
    counter: '',
  }

  async componentDidMount() {
    const {majorCountries, visitsCounter} = await fetchAllDailyStatsForMajorCountries();
    const initCoutries = majorCountries.slice(0, 10);
    this.setState({
                    topCountries: majorCountries,
                    interestedCoutries: initCoutries,
                    dailyGlobalStats: await fetchDailyData(), 
                    dailyStatsForCountries: await fetchAllDailyStatsForCountries(initCoutries), 
                    //snapshotStats: await fetchData(),
                    counter: visitsCounter,
                });
  }

  handleCountryChange = async (checked, country) => {
    if(checked) {
      this.setState({
        interestedCoutries: [...this.state.interestedCoutries, country],
        dailyStatsForCountries: [...this.state.dailyStatsForCountries, ...await fetchAllDailyStatsForCountries(country)],
      });
    } else {
      this.setState({
        interestedCoutries: this.state.interestedCoutries.filter(item => country !== item),
        dailyStatsForCountries: this.state.dailyStatsForCountries.filter(dailyStats => country !== dailyStats[0].countryName),
      });
    }
  }

  render() {
    const {topCountries, interestedCoutries, dailyGlobalStats, dailyStatsForCountries, counter} = this.state;

    return (
      <div>
        <header align='center'>
          <h1>COVID-19 Global Daily Stats by Country</h1>
        </header>
        <div className={styles.container}>
          <div className={styles.nav}>
            <h3>Top 40 Countries</h3>(Sort by Confirmed Cases as of Today):
            {topCountries.map((country, i) => <CountryCheckbox key={i} checkboxLabel={country} checked={interestedCoutries.includes(country)} handleCountryChange={this.handleCountryChange} />)}
          </div>
          <div className={styles.charts}>
            <Charts timeSeries={dailyGlobalStats} countryPicked='Global' rank=''/>
            {dailyStatsForCountries.map((dailyStats, i) => <Charts key={i} timeSeries={dailyStats} countryPicked={dailyStats[0]? dailyStats[0].countryName : ''} rank={topCountries.indexOf(dailyStats[0].countryName) + 1} />)}
            {/* <CountryPicker handleCountryChange={this.handleCountryChange} />
            <Cards snapshotStats={snapshotStats} /> */}
          </div>
        </div>
        <footer align='center'>
          <p>Visitors: {counter}</p>
          Provided by Monad Wisdom Technologies, 2020. If any suggestion, please email us at: wisdomspringtech@yahoo.com
        </footer>
      </div>
    )
  }
}

export default App;
