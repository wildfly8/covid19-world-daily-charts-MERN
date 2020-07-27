var express = require('express');
var router = express.Router();
const CountryDailyCovidStats = require('../models/CountryDailyCovidStats');
const ProvinceDailyCovidStats = require('../models/ProvinceDailyCovidStats');
const siteViews = require('../models/visits');
const SiteViewsUp = require('../site_analysis/visitsUp');

router.get('/daily_stats/majorCountries', async (req, res) => {
  //api source analysis upon user first arrival
  let visitsCounter = 0;
  SiteViewsUp.siteViewsUp();
  siteViews.findById('5ee99d1119c7f231545d495d')
  .then((data) => {
    visitsCounter = data.counter;
  }, (err) => {next(err)})
  .catch((err) => next(err))
  //DB call
  try {
    //find top 40 countries with most confirmed cases
    const { lastUpdate } = await CountryDailyCovidStats.findOne({}, {}, {sort: {'lastUpdate': -1}});
    const majorCountries = await CountryDailyCovidStats
      .find({"lastUpdate": {"$gte": new Date(lastUpdate.getFullYear(), lastUpdate.getMonth(), lastUpdate.getDate())}})
      .sort({'confirmed': -1})
      .limit(40);
    res.json({majorCountries: majorCountries.map((country) => country.countryName.replace(/,/g, ';')), visitsCounter});
  } catch (error) {
      res.status(500).json({message: error.message})
  }
});

router.get('/daily_stats', async (req, res) => {
  //DB call
  try {
    const names = req.query.countryNames.split(',');
    let allDailyStats = [];
    for(const name of names) {
      allDailyStats.push(await CountryDailyCovidStats.find({countryName: name.replace(/;/g, ',')}));
    }
    res.json(allDailyStats);
  } catch (error) {
      res.status(500).json({message: error.message})
  }
});

router.get('/daily_stats/province', async (req, res) => {
  //DB call
  try {
    const names = req.query.countryNames.split(',');
    let allDailyProvinceStats = [];
    for(const name of names) {
      const allStatsForCountryQuery = ProvinceDailyCovidStats.find({countryName: name.replace(/;/g, ',')});
      const allStatsForCountry = await allStatsForCountryQuery.exec();
      const provinces = await allStatsForCountryQuery.distinct('province').exec();
      for(const province of provinces) {
        allDailyProvinceStats.push(allStatsForCountry.filter(doc => doc.province === province));
      };
      allDailyProvinceStats.sort((a, b) => b[b.length - 1].confirmed - a[a.length - 1].confirmed);
    }
    res.json(allDailyProvinceStats);
  } catch (error) {
      res.status(500).json({message: error.message})
  }
});

module.exports = router;
