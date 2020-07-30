import React, { useState, useEffect, useContext, useCallback } from 'react';
import { fetchAllDailyStatsForProvinces } from './api';
import Charts from './components/Charts/Charts'
import CountryCheckbox from './CountryCheckbox';
// @ts-ignore
import styles from './App.module.css';
import useStateWithSessionStorage from './useStateWithSessionStorage';
import { MyContext } from './MyContext';

const screenRows = 10

const Province = () => {
  const [majorCountries] = useStateWithSessionStorage('majorCountries')
  const [interestedCountries, setInterestedCountries] = useState([majorCountries.split(',')[0]])
  const [dailyProvinceStats, setDailyProvinceStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [pageNumber, setPageNumber] = useState(0)
  const [visitsCounter] = useContext(MyContext);

  const domInstanceWatched = useCallback(node => {
    if (loading) {
      return
    }
    if (domInstanceWatched.current) {
      domInstanceWatched.current.disconnect()
    }
    domInstanceWatched.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) {
      domInstanceWatched.current.observe(node)
    }
  }, [loading, hasMore])

  useEffect(() => {
    (async () => {
      if(majorCountries && 'null' !== majorCountries && interestedCountries && interestedCountries[0]) {
        setLoading(true)
        const paginatedAPIResult = await fetchAllDailyStatsForProvinces(interestedCountries[0], pageNumber)
        setDailyProvinceStats(prevStats => [...prevStats, ...paginatedAPIResult])
        setHasMore(paginatedAPIResult.length >= screenRows)
        setLoading(false)
      }
    })();
  }, [majorCountries, interestedCountries, pageNumber]);

  const handleCountryChange = (checked, country) => {
    if(checked) {
      setInterestedCountries([country])
      setDailyProvinceStats([])
      setPageNumber(0)
      setHasMore(false)
    } else {
      setInterestedCountries(interestedCountries.filter(item => country !== item))
      setDailyProvinceStats(dailyProvinceStats.filter(dailyStats => country !== dailyStats[0].countryName.replace(/,/g, ';')))
      setPageNumber(0)
      setHasMore(false)
    }
  };

  return (
      <>
        <div className={styles.container}>
          <div className={styles.nav}>
            <h3>Top 40 Countries</h3>(Sort by Confirmed Cases as of Today):
            {majorCountries.split(',').map((country, i) => <CountryCheckbox key={i} checkboxLabel={country} checked={interestedCountries.includes(country)} handleCountryChange={handleCountryChange} />)}
          </div>
          <h2 style={{color: "orange"}}>{loading && !hasMore && 'Loading All Province Daily Stats Charts......'}</h2>
          <div className={styles.charts}>
              {dailyProvinceStats.map((dailyStats, i) => {
                if (dailyProvinceStats.length === i + 1) {
                  return <div key={i} ref={domInstanceWatched}><Charts timeSeries={dailyStats} countryPicked={dailyStats[0]? dailyStats[0].countryName + ' ' + dailyStats[0].province : ''} rank={i + 1} isProvince={true} /></div>
                } else {
                  return <Charts key={i} timeSeries={dailyStats} countryPicked={dailyStats[0]? dailyStats[0].countryName + ' ' + dailyStats[0].province : ''} rank={i + 1} isProvince={true} />
                }
              })}
          </div>
        </div>
        <div className={styles.Footer}>
          <h3 style={{color: "orange"}}>{(loading || hasMore) && 'Continue Loading All Province Daily Stats Charts......'}</h3>
          <footer>
            <p>Visitors: {visitsCounter}</p>
            Provided by Monad Wisdom Technologies, 2020. If any suggestion, please email us at: wisdomspringtech@yahoo.com
          </footer>
        </div>
      </>
  );
};

export default Province;
