import axios from 'axios';
//import faker from 'faker';

// const users = [...new Array(10)].map(() => ({
//     id: faker.random.uuid(),
//     avatar: faker.image.avatar(),
//     username: faker.internet.userName(),
//     name: `${faker.name.firstName()} ${faker.name.lastName()}`,
//   }));

// export const fetchUsers = async authUser =>
//   authUser && authUser.groups.includes('Admins')
//     ? users.map(user => ({
//         ...faker.helpers.userCard(), ...user,
//       }))
//     : users;

const url = 'https://covid19.mathdro.id/api';

export const fetchUserLoginStatus = async (name) => {
    try {
        const {data} = await axios.get(`/api/checkUserLoginStatus?name=${name}`);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const fetchVisitsCounter = async () => {
    try {
        const {data} = await axios.get(`/api/visitsCounter`);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const fetchAllDailyStatsForMajorCountries = async () => {
    try {
        const {data} = await axios.get(`/api/daily_stats/majorCountries`);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const fetchAllDailyStatsForCountries = async (countryNames) => {
    try {
        const {data} = await axios.get(`/api/daily_stats?countryNames=${countryNames}`);  
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const fetchAllDailyStatsForProvinces = async (countryName, pageNumber) => {
    try {
        const {data} = await axios.get(`/api/daily_stats/province?countryNames=${countryName}&pageNumber=${pageNumber}`);  
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const fetchData = async (country) => {
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

export const fetchDailyData = async () => {
    try {
        const {data} = await axios.get(`${url}/daily`);
        const modifiedData = data.map((dailyData) => ({
            confirmed: dailyData.confirmed.total,
            deaths: dailyData.deaths.total,
            date: dailyData.reportDate,
        }));
        return modifiedData;
    } catch (error) {
        console.log(error);
    }
}

export const fetchCountries = async () => {
    try {
        const {data: {countries}} = await axios.get(`${url}/countries`);
        return countries.map((country) => country.name);
    } catch (error) {
        console.log(error);
    }
}