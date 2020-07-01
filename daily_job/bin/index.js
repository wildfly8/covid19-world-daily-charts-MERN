#!/usr/bin/env node

const mongoose = require('mongoose');
const { default: axios } = require('axios');
const CountryDailyCovidStats = require('./CountryDailyCovidStats.js')
const url = "https://api.covid19api.com";
const DB_NAME = 'covid19';

(async () => {
    let db = null;
    try {
        //open MongoDB covid19 db connection
        await mongoose.connect('mongodb://localhost/' + DB_NAME, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB covid19 db connected successfully.');
        db = mongoose.connection;
        db.on('error', (error) => console.error(error));
        db.once('open', () => console.log('Opened DB connection'));
        db.once('close', () => console.log('Closed DB connection'));
        //fetch api for all countries
        const allCountries = await fetchCountries();
        for(const { Slug, ISO2 } of allCountries) {
            try {
                //daily append job
                const allDailyRawStats = await fetchAllDailyStatsForCountry(Slug);
                if(allDailyRawStats && allDailyRawStats.length > 0) {
                    const { Country, Confirmed, Recovered, Deaths, Date: apiDate } = allDailyRawStats[allDailyRawStats.length - 1];
                    const {lastUpdate} = await CountryDailyCovidStats.findOne({}, {}, {sort: {'lastUpdate': -1}});
                    const lastUpdateDB = new Date(lastUpdate);
                    const lastUpdateAPI = new Date(apiDate);
                    lastUpdateAPI.setHours(0, 0, 0, 0);
                    lastUpdateDB.setHours(0, 0, 0, 0);
                    if(lastUpdateAPI > lastUpdateDB) {
                        const newDailyStats = new CountryDailyCovidStats({countryName: Country, countrySlug: Slug, countryCode: ISO2, confirmed: Confirmed, recovered: Recovered, deaths: Deaths, lastUpdate: new Date(apiDate)});
                        await newDailyStats.save();
                        console.log(Slug + ' appended to country_daily_stats collection.');
                    } else {
                        console.log(Slug + ' skipped.');   
                    }
                }

                //init job
                // const allDailyRawStats = await fetchAllDailyStatsForCountry(Slug);
                // const allDailyStats = allDailyRawStats.map(({ Country, Confirmed, Deaths, Recovered, Date }) => {
                //     return new CountryDailyCovidStats({countryName: Country, countrySlug: Slug, countryCode: ISO2, confirmed: Confirmed, recovered: Recovered, deaths: Deaths, lastUpdate: Date});
                // });
                // await CountryDailyCovidStats.create(allDailyStats);
                // console.log(Slug + ' saved to country_daily_stats collection.');
            } catch (err) {
                console.log(Slug + ' error: ' + err);
                continue;
            }
        } 
    } catch (err) {
        console.log('error: ' + err);
    } finally {
        if(db != null) {
            db.close();
        }
        console.log("daily_job finished successfully.")
    }
  })();

const fetchAllDailyStatsForCountry = async (countrySlug) => {
    try {
        const {data} = await axios.get(`${url}/total/dayone/country/${countrySlug}`);
        return data;
    } catch (error) {
        console.error(error);
    }
}

const fetchCountries = async () => {
    try {
        const {data} = await axios.get(`${url}/countries`);
        return data;
    } catch (error) {
        console.log(error);
    }
}

process.on('exit', function(code) {
    return console.log(`About to exit with code ${code}`);
});
