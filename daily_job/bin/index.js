#!/usr/bin/env node

const axios = require("axios");
const url = "https://covid19.mathdro.id/api";

const fetchData = async (country) => {
    let changeableUrl = url;
    if(country) {
        changeableUrl = `${url}/countries/${country}`;
    }
    try {
        const {data: {confirmed, recovered, deaths, lastUpdate}} = await axios.get(changeableUrl);
        return {confirmed, recovered, deaths, lastUpdate,}
    } catch (error) {
        console.log(error);
    }
}