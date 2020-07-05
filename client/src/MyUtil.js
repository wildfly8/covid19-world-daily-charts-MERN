export const formatDate = (date) => {
    let year = new Date(date).getFullYear();
    let month = new Date(date).getUTCMonth() + 1;
    let dt = new Date(date).getUTCDate();
    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return month + '-' + dt + '-' + year.toString().slice(-2);
};

export const smoothTimeSeries = (timeSeries) => {
    timeSeries.forEach((element, i) => {
        if(i > 0) {
            if(i < (timeSeries.length - 1)) {
                if(element.confirmed < timeSeries[i - 1].confirmed) {
                    element.confirmed = Math.max(Math.round((timeSeries[i - 1].confirmed + timeSeries[i + 1].confirmed) / 2), timeSeries[i - 1].confirmed);
                }
            } else {
                if(element.confirmed < timeSeries[i - 1].confirmed) {
                    element.confirmed = timeSeries[i - 1].Confirmed;
                }
            }
        }
        if(i > 0) {
            if(i < (timeSeries.length - 1)) {
                if(element.deaths < timeSeries[i - 1].deaths) {
                    element.deaths = Math.max(Math.round((timeSeries[i - 1].deaths + timeSeries[i + 1].deaths) / 2), timeSeries[i - 1].deaths);
                }
            } else {
                if(element.deaths < timeSeries[i - 1].deaths) {
                    element.deaths = timeSeries[i - 1].deaths;
                }
            }
        }
    });
}

export const transformToDailyNewStats = (timeSeries) => {
    if(timeSeries) {
        return timeSeries.map((moment, i) => {
            let momentCopy = {};
            if(i === 0) {
                if(moment.date) {
                    momentCopy.date = moment.date;
                } else {
                    momentCopy.lastUpdate = moment.lastUpdate;
                }
                momentCopy.confirmed = moment.confirmed;
                momentCopy.deaths = moment.deaths;
            } else {
                if(moment.date) {
                    momentCopy.date = moment.date;
                } else {
                    momentCopy.lastUpdate = moment.lastUpdate;
                }
                momentCopy.confirmed = moment.confirmed - timeSeries[i-1].confirmed;
                momentCopy.deaths = moment.deaths - timeSeries[i-1].deaths;
            }
            return momentCopy;
        }).filter((moment, i) => (i > 0));
    }
};