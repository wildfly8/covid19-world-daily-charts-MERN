var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const CountryDailyCovidStats = require('../models/CountryDailyCovidStats')

router.get('/daily_stats', async (req, res) => {
  try {
    const names = req.query.countryNames.split(',');
    allDailyStats = [];
    for(const name of names) {
      allDailyStats.push(await CountryDailyCovidStats.find({countryName: name.replace(/;/g, ',')}));
    }
    res.json(allDailyStats);
  } catch (error) {
      res.status(500).json({message: error.message})
  }
});

module.exports = router;
