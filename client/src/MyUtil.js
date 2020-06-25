export const formatDate = (date) => {
    let year = new Date(date).getFullYear();
    let month = new Date(date).getMonth() + 1;
    let dt = new Date(date).getDate();
    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return month + '-' + dt + '-' + year.toString().slice(-2);
};

export const transformToDailyNewStats = (timeSeries) => {
    if(timeSeries) {
        return timeSeries.map((moment, i) => {
            let momentCopy = {};
            if(i === 0) {
                momentCopy.date = moment.date;
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
        }).filter((moment, i) => i > 0);
    }
};