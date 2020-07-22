import React, { useState, useEffect } from 'react';
import { fetchAllDailyStatsForMajorCountries, fetchAllDailyStatsForProvinces } from './api';
import Charts from './components/Charts/Charts'
import CountryCheckbox from './CountryCheckbox';
// @ts-ignore
import styles from './App.module.css';


const Province = () => {
  const [topCountries, setTopCountries] = useState([]);
  const [interested, setInterested] = useState({interestedCoutries: [], dailyProvinceStats: []});
  const {interestedCoutries, dailyProvinceStats} = interested;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { majorCountries } = await fetchAllDailyStatsForMajorCountries();
      const initCoutries = majorCountries.slice(0, 10);
      setTopCountries(majorCountries);
      setInterested({interestedCoutries: initCoutries[0], dailyProvinceStats: await fetchAllDailyStatsForProvinces(initCoutries[0])})
      setIsLoaded(true);
    })();
  }, []);

  const handleCountryChange = async (checked, country) => {
    if(checked) {
      setInterested({interestedCoutries: [country], dailyProvinceStats: [...await fetchAllDailyStatsForProvinces(country)]})
    } else {
      setInterested({interestedCoutries: interestedCoutries.filter(item => country !== item), dailyProvinceStats: dailyProvinceStats.filter(dailyStats => country !== dailyStats[0].countryName.replace(/,/g, ';'))})
    }
  };

  return (
    <div>
      {!isLoaded ? (
        <div className={styles.container}>
          <h2>Loading All Province Daily Stats Charts...</h2>
        </div>
        ) : (
          <div className={styles.container}>
            <div className={styles.nav}>
              <h3>Top 40 Countries</h3>(Sort by Confirmed Cases as of Today):
              {topCountries.map((country, i) => <CountryCheckbox key={i} checkboxLabel={country} checked={interestedCoutries.includes(country)} handleCountryChange={handleCountryChange} />)}
            </div>
            <div className={styles.charts}>
                {dailyProvinceStats.map((dailyStats, i) => <Charts key={i} timeSeries={dailyStats} countryPicked={dailyStats[0]? dailyStats[0].countryName + ' ' + dailyStats[0].province : ''} rank={i + 1} isProvince={true} />)}
            </div>
          </div>
        )}
    </div>
  );
};

export default Province;
