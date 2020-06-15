const mongoose = require('mongoose');

const CountryDailyCovidStatsSchema = new mongoose.Schema(
  {
    countryName: String,
    confirmed: Number,
    recovered: Number,
    deaths: Number,
    lastUpdate: { type: Date, default: Date.now },
  }
);

module.exports = mongoose.model('CountryDailyCovidStats', CountryDailyCovidStatsSchema, 'country_daily_stats');