import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
// @ts-ignore
import { Security, ImplicitCallback } from '@okta/okta-react';
import { CssBaseline } from '@material-ui/core';
import { AuthHandler, AuthProvider, AuthContext } from './Auth';
//import Cards from './components/Cards/Cards'
//import CountryPicker from './components/CountryPicker/CountryPicker'
//import Search from './components/Search';
//import SelectedUser from './components/SelectedUser';
import { fetchAllDailyStatsForMajorCountries, fetchAllDailyStatsForCountries, fetchDailyData } from './api';
import Header from './components/Header';
import Charts from './components/Charts/Charts'
import CountryCheckbox from './components/CountryCheckbox/CountryCheckbox';
// @ts-ignore
import styles from './App.module.css';
require('dotenv').config();


let countUseContext = 0;
const App = () => {
  const [topCountries, setTopCountries] = React.useState([]);
  const [interested, setInterested] = React.useState({interestedCoutries: [], dailyStatsForCountries: []});
  const {interestedCoutries, dailyStatsForCountries} = interested;
  const [dailyGlobalStats, setDailyGlobalStats] = React.useState([]);
  const [counter, setCounter] = React.useState('');
  const [isLoaded, setIsLoaded] = React.useState(false);

  const auth = React.useContext(AuthContext);
  console.log('countUseContext=' + (++countUseContext) + ' user=' + (!auth || !auth.user? null : auth.user.name) )

  React.useEffect(() => {
    (async () => {
      const {majorCountries, visitsCounter} = await fetchAllDailyStatsForMajorCountries();
      const initCoutries = majorCountries.slice(0, 10);
      setTopCountries(majorCountries);
       setInterested({interestedCoutries: initCoutries, dailyStatsForCountries: await fetchAllDailyStatsForCountries(initCoutries)})
      setDailyGlobalStats(await fetchDailyData());
      setCounter(visitsCounter);
      setIsLoaded(true);
    })();
  }, []);

  const handleCountryChange = async (checked, country) => {
    if(checked) {
      setInterested({interestedCoutries: [...interestedCoutries, country], dailyStatsForCountries: [...dailyStatsForCountries, ...await fetchAllDailyStatsForCountries(country)]})
    } else {
      setInterested({interestedCoutries: interestedCoutries.filter(item => country !== item), dailyStatsForCountries: dailyStatsForCountries.filter(dailyStats => country !== dailyStats[0].countryName)})
    }
  }  
    return (
      <React.Fragment>
        <CssBaseline />
        <Header />
        {!isLoaded ? (
          <h2>Loading All Country Daily Stats Charts...</h2>
        ) : (
          <div className={styles.container}>
            <div className={styles.nav}>
              <h3>Top 40 Countries</h3>(Sort by Confirmed Cases as of Today):
              {topCountries.map((country, i) => <CountryCheckbox key={i} checkboxLabel={country} checked={interestedCoutries.includes(country)} handleCountryChange={handleCountryChange} />)}
            </div>
            <div className={styles.charts}>
                <Charts timeSeries={dailyGlobalStats} countryPicked='Global' rank=''/>
                {dailyStatsForCountries.map((dailyStats, i) => <Charts key={i} timeSeries={dailyStats} countryPicked={dailyStats[0]? dailyStats[0].countryName : ''} rank={topCountries.indexOf(dailyStats[0].countryName) + 1} />)}
                {/* <CountryPicker handleCountryChange={handleCountryChange} />
                <Cards snapshotStats={snapshotStats} /> */}
            </div>
          </div>
        )}
        <footer 
        // @ts-ignore
        align="center">
            <p>Visitors: {counter}</p>
            Provided by Monad Wisdom Technologies, 2020. If any suggestion, please email us at: wisdomspringtech@yahoo.com
        </footer>
        <AuthHandler />
      </React.Fragment>
    )
  }

export default () => (
  <AuthProvider>
    <Router>
      <Security
        issuer={`${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`}
        client_id={process.env.REACT_APP_OKTA_CLIENT_ID}
        redirect_uri={`${window.location.origin}/implicit/callback`}
      >
        <Switch>
          <Route path="/implicit/callback" component={ImplicitCallback} />
          <Route path="/" component={App} />
        </Switch>
      </Security>
    </Router>
  </AuthProvider>
);
