#!/usr/bin/env node

const mongoose = require('mongoose');
const axios = require("axios");
const CountryDailyCovidStats = require('./CountryDailyCovidStats.js')
const url = "https://covid19.mathdro.id/api";
const DB_NAME = 'covid19';

(async () => {
    try {
        //open MongoDB covid19 db connection
        await mongoose.connect('mongodb://localhost/' + DB_NAME, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB covid19 db connected successfully.');
        const db = mongoose.connection;
        db.on('error', (error) => console.error(error));
        db.once('open', () => console.log('Opened DB connection'));
        db.once('close', () => console.log('Closed DB connection'));
        //fetch api for all countries
        const allCountries = await fetchCountries();
        for(const country of allCountries) {
            try {
                //fetch daily stats api for each country
                const {confirmed, recovered, deaths, lastUpdate} = await fetchCountryDailyStats(country);
                //save result for each country
                const stats = new CountryDailyCovidStats({countryName: country, confirmed: confirmed.value, recovered: recovered.value, deaths: deaths.value, lastUpdate: lastUpdate});
                await stats.save();
                console.log(country + ' saved to country_daily_stats collection.');
            } catch (err) {
                console.log('error: ' + err);
                continue;
            }
        } 
        db.close();
    } catch (err) {
        console.log('error: ' + err);
        db.close();
    }
  })();

const fetchCountryDailyStats = async (country) => {
    let changeableUrl = url;
    if(country) {
        changeableUrl = `${url}/countries/${country}`;
    }
    try {
        const {data: {confirmed, recovered, deaths, lastUpdate}} = await axios.get(changeableUrl);
        return {confirmed, recovered, deaths, lastUpdate};
    } catch (error) {
        console.error(error);
    }
}

const fetchCountries = async () => {
    try {
        const {data: {countries}} = await axios.get(`${url}/countries`);
        return countries.map((country) => country.name);
    } catch (error) {
        console.log(error);
    }
}

process.on('exit', function(code) {
    return console.log(`About to exit with code ${code}`);
});
