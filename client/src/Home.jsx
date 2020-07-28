import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { fetchAllDailyStatsForMajorCountries, fetchAllDailyStatsForCountries, fetchDailyData } from './api';
import Charts from './components/Charts/Charts'
import CountryCheckbox from './CountryCheckbox';
// @ts-ignore
import styles from './App.module.css';
import useStateWithSessionStorage from './useStateWithSessionStorage';


let countUseContext = 0;

const Home = () => {
  const { authState, authService } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  console.log('countUseContext=' + (++countUseContext) + ' user=' + (!authState.isAuthenticated || !userInfo? null : userInfo.name) )
  const [majorCountries, setMajorCountries] = useStateWithSessionStorage('majorCountries');
  const [interested, setInterested] = React.useState({interestedCountries: [], dailyStatsForCountries: []});
  const {interestedCountries, dailyStatsForCountries} = interested;
  const [dailyGlobalStats, setDailyGlobalStats] = React.useState([]);
  const [counter, setCounter] = React.useState('');
  const [isLoaded, setIsLoaded] = React.useState(false);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      setUserInfo(null);
    } else {
      authService.getUser().then((info) => {
        setUserInfo(info);
      });
    }
  }, [authState, authService]); // Update if authState changes

  useEffect(() => {
    (async () => {
      const {majorCountries, visitsCounter} = await fetchAllDailyStatsForMajorCountries();
      setMajorCountries(majorCountries);
      const initCoutries = majorCountries.slice(0, 10);
      setInterested({interestedCountries: initCoutries, dailyStatsForCountries: await fetchAllDailyStatsForCountries(initCoutries)})
      setDailyGlobalStats(await fetchDailyData());
      setCounter(visitsCounter);
      setIsLoaded(true);
    })();
  }, [setMajorCountries]);

  const handleCountryChange = async (checked, country) => {
    if(checked) {
      setInterested({interestedCountries: [...interestedCountries, country], dailyStatsForCountries: [...dailyStatsForCountries, ...await fetchAllDailyStatsForCountries(country)]})
    } else {
      setInterested({interestedCountries: interestedCountries.filter(item => country !== item), dailyStatsForCountries: dailyStatsForCountries.filter(dailyStats => country !== dailyStats[0].countryName.replace(/,/g, ';'))})
    }
  };

  if (authState.isPending) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div>
      {!isLoaded ? (
        <div className={styles.container}>
          <h2>Loading All Country Daily Stats Charts...</h2>
        </div>
        ) : (
          <div className={styles.container}>
            <div className={styles.nav}>
              <h3>Top 40 Countries</h3>(Sort by Confirmed Cases as of Today):
              {majorCountries.map((country, i) => <CountryCheckbox key={i} checkboxLabel={country} checked={interestedCountries.includes(country)} handleCountryChange={handleCountryChange} />)}
            </div>
            <div className={styles.charts}>
                <Charts timeSeries={dailyGlobalStats} countryPicked='Global' rank='' isProvince={false} />
                {dailyStatsForCountries.map((dailyStats, i) => <Charts key={i} timeSeries={dailyStats} countryPicked={dailyStats[0]? dailyStats[0].countryName : ''} rank={majorCountries.indexOf(dailyStats[0].countryName) + 1} isProvince={false} />)}
                {/* <CountryPicker handleCountryChange={handleCountryChange} />
                <Cards snapshotStats={snapshotStats} /> */}
            </div>
          </div>
        )}
        <div className={styles.Footer}>
          <footer>
            <p>Visitors: {counter}</p>
            Provided by Monad Wisdom Technologies, 2020. If any suggestion, please email us at: wisdomspringtech@yahoo.com
          </footer>
        </div>
    </div>
  );
};
export default Home;
