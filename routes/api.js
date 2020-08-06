var express = require('express');
var router = express.Router();
const OktaJwtVerifier = require('@okta/jwt-verifier');
const CountryDailyCovidStats = require('../models/CountryDailyCovidStats');
const ProvinceDailyCovidStats = require('../models/ProvinceDailyCovidStats');
const siteViews = require('../models/visits');
const SiteViewsUp = require('../site_analysis/visitsUp');
const sampleConfig = require('../config.js');

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: sampleConfig.resourceServer.oidc.clientId,
  issuer: sampleConfig.resourceServer.oidc.issuer,
  assertClaims: sampleConfig.resourceServer.assertClaims,
  testing: sampleConfig.resourceServer.oidc.testing
});

/**
 * A simple middleware that asserts valid access tokens and sends 401 responses
 * if the token is not present or fails validation.  If the token is valid its
 * contents are attached to req.jwt
 */
const authenticationRequired = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);
  if (!match) {
    res.status(401);
    return next('Unauthorized');
  }
  const accessToken = match[1];
  const audience = sampleConfig.resourceServer.assertClaims.aud;
  return oktaJwtVerifier.verifyAccessToken(accessToken, audience)
    .then((jwt) => {
      req.jwt = jwt;
      next();
    })
    .catch((err) => {
      res.status(401).send(err.message);
    });
}

router.get('/chat', authenticationRequired, (req, res) => {
  const userSub = req.query.user;
  res.json({
    //temp, need to wait for Cassandra store pipeline finished.
    rooms: [
      {
        roomName: 'DM-Shin Xu-Lizzy',
        members: ['Shin Xu', 'Lizzy'],
      },
      {
        roomName: 'DM-Test Account-Shin Xu',
        members: ['Test Account', 'Shin Xu'],
      },
      {
        roomName: 'DM-Test Account-Lizzy',
        members: ['Test Account', 'Lizzy'],
      },
      {
        roomName: 'Channel-Test',
        members: ['Test Account', 'Shin Xu', 'Lizzy'],
      }
    ]
  });
});

router.get('/visitsCounter', async (req, res) => {
  //api source analysis upon user first arrival
  let visitsCounter = 0;
  try {
    SiteViewsUp.siteViewsUp();
     const data = await siteViews.findById('5ee99d1119c7f231545d495d')
     visitsCounter = data.counter;
    res.json(visitsCounter);
  } catch (error) {
      res.status(500).json({message: error.message})
  }
});

router.get('/daily_stats/majorCountries', async (req, res) => {
  //DB call
  try {
    //find top 40 countries with most confirmed cases
    const { lastUpdate } = await CountryDailyCovidStats.findOne({}, {}, {sort: {'lastUpdate': -1}});
    const majorCountries = await CountryDailyCovidStats
      .find({"lastUpdate": {"$gte": new Date(lastUpdate.getFullYear(), lastUpdate.getMonth(), lastUpdate.getDate())}})
      .sort({'confirmed': -1})
      .limit(40);
    res.json(majorCountries.map((country) => country.countryName.replace(/,/g, ';')));
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

let allDailyProvinceStatsAll = {};

router.get('/daily_stats/province', async (req, res) => {
  //DB call
  try {
    const names = req.query.countryNames.split(',');
    const pageNumber = parseInt(req.query.pageNumber);
    if(pageNumber === 0) {
      for(const name of names) {
        let allDailyProvinceStats = [];
        const allStatsForCountryQuery = ProvinceDailyCovidStats.find({countryName: name.replace(/;/g, ',')});
        const allStatsForCountry = await allStatsForCountryQuery.exec();
        const provinces = await allStatsForCountryQuery.distinct('province').exec();
        for(const province of provinces) {
          allDailyProvinceStats.push(allStatsForCountry.filter(doc => doc.province === province));
        };
        allDailyProvinceStats.sort((a, b) => b[b.length - 1].confirmed - a[a.length - 1].confirmed);
        allDailyProvinceStatsAll[name] = allDailyProvinceStats
      }
    }
    let paginatedResult = []
    const screenRows = 10
    for(const name of names) {
      if((pageNumber + 1) * screenRows  - 1 <= (allDailyProvinceStatsAll[name].length - 1)) {
        paginatedResult = allDailyProvinceStatsAll[name].slice(pageNumber * screenRows, (pageNumber + 1) * screenRows)
      } else if(pageNumber * screenRows <= (allDailyProvinceStatsAll[name].length - 1)) {
        paginatedResult = allDailyProvinceStatsAll[name].slice(pageNumber * screenRows)
      }
    }
    res.json(paginatedResult)
  } catch (error) {
      res.status(500).json({message: error.message})
  }
});

module.exports = router;
