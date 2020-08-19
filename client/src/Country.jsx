import React, { useState, useEffect, useContext } from 'react';
import { fetchDailyStatsMajorCountries, fetchAllDailyStatsForCountries, fetchGlobalDailyData } from './api';
import Charts from './components/Charts/Charts'
import CountryCheckbox from './components/CountryCheckbox';
// @ts-ignore
import styles from './App.module.css';
import { MyContext } from './MyContext';


const majorCountriesFromSessionStorage = sessionStorage.getItem('majorCountries')

const Country = () => {
  const [majorCountries, setMajorCountries] = useState(majorCountriesFromSessionStorage? majorCountriesFromSessionStorage.split(',') : [])
  const [interested, setInterested] = useState({interestedCountries: [], dailyStatsForCountries: []});
  const { interestedCountries, dailyStatsForCountries } = interested;
  const [dailyGlobalStats, setDailyGlobalStats] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { visits } = useContext(MyContext);
  const [visitsCounter, ] = visits;

  useEffect(() => {
    (async () => {
      if(majorCountries.length === 0) {
        const majorCountriesAPI = await fetchDailyStatsMajorCountries();
        setMajorCountries(majorCountriesAPI);
        sessionStorage.setItem('majorCountries', majorCountriesAPI);
        const initCoutries = majorCountriesAPI.slice(0, 10)
        setInterested({interestedCountries: initCoutries, dailyStatsForCountries: await fetchAllDailyStatsForCountries(initCoutries)})
  
      } else {
        const initCoutries = majorCountries.slice(0, 10)
        setInterested({interestedCountries: initCoutries, dailyStatsForCountries: await fetchAllDailyStatsForCountries(initCoutries)})  
      }
      setDailyGlobalStats(await fetchGlobalDailyData());
      setIsLoaded(true);
    })();
  }, [majorCountries]);

  const handleCountryChange = async (checked, country) => {
    if(checked) {
      setInterested({interestedCountries: [...interestedCountries, country], dailyStatsForCountries: [...dailyStatsForCountries, ...await fetchAllDailyStatsForCountries(country)]})
    } else {
      setInterested({interestedCountries: interestedCountries.filter(item => country !== item), dailyStatsForCountries: dailyStatsForCountries.filter(dailyStats => country !== dailyStats[0].countryName.replace(/,/g, ';'))})
    }
  };

  return (
    <div className={styles.grid_container}>
      <nav className={styles.grid_item_nav}>
        <h3>Top 40 Countries</h3>(Sort by Confirmed Cases as of Today):
        {majorCountries.map((country, i) => <CountryCheckbox key={i} checkboxLabel={country} checked={interestedCountries.includes(country)} handleCountryChange={handleCountryChange} />)}
      </nav>
      {!isLoaded ? (
            <main className={styles.grid_item_content}><h2 style={{color: "orange"}}>Loading All Country Daily Stats Charts...</h2></main>
        ) : (
            <main className={styles.grid_item_content}>
              <Charts timeSeries={dailyGlobalStats} countryPicked='Global' rank='' isProvince={false} />
               {dailyStatsForCountries.map((dailyStats, i) => <Charts key={i} timeSeries={dailyStats} countryPicked={dailyStats[0]? dailyStats[0].countryName : ''} rank={majorCountries.indexOf(dailyStats[0].countryName) + 1} isProvince={false} />)}
               {/* <CountryPicker handleCountryChange={handleCountryChange} />
               <Cards snapshotStats={snapshotStats} /> */}
            </main>
      )}
      <output className={styles.grid_item_infobar}>Visitors: {visitsCounter}</output>
      <footer className={styles.grid_item_footer}><small>Copyright &copy; Monad Wisdom Technologies. All rights reserved. If any suggestion, please email us at: wisdomspringtech@yahoo.com</small></footer> 
    </div>
  );
};
export default Country;
