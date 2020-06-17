var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const CountryDailyCovidStats = require('../models/CountryDailyCovidStats');
const siteViews = require('../models/visits');
const SiteViewsUp = require('../site_analysis/visitsUp');

router.get('/daily_stats', async (req, res) => {
  //api source analysis
  let visitsCounter = 0;
  SiteViewsUp.siteViewsUp();
  siteViews.findById('5ee99d1119c7f231545d495d')
  .then((data) => {
    visitsCounter = data.counter;
  }, (err) => {next(err)})
  .catch((err) => next(err))
  //DB call
  try {
    const names = req.query.countryNames.split(',');
    allDailyStats = [];
    for(const name of names) {
      allDailyStats.push(await CountryDailyCovidStats.find({countryName: name.replace(/;/g, ',')}));
    }
    res.json({allDailyStats, visitsCounter});
  } catch (error) {
      res.status(500).json({message: error.message})
  }
});

module.exports = router;
