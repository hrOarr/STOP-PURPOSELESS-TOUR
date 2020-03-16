var TypeListEnum = {
    ToDay: 1,
    All: 2,
};
var STORAGE_TABS = 'tabs';
function isEmpty(obj) {
    for (var prop in obj){
        if (obj.hasOwnProperty(prop))
            return false;
    }
    return JSON.stringify(obj) === JSON.stringify({});
}
function convertTimeToSummaryTime(time) {
    var timeValue = time.split(':');
    var hour = timeValue[0];
    var min = timeValue[1];
    var resultTimeValue = 0;
    if (hour > 0)
        resultTimeValue = hour * 3600;
    resultTimeValue += min * 60;

    return resultTimeValue;
}
function getArrayTime(summaryTime) {
    var days = Math.floor(summaryTime / 3600 / 24);
    var totalHours = summaryTime % (3600 * 24);
    var hours = Math.floor(totalHours / 3600);
    var totalSeconds = summaryTime % 3600;
    var mins = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;

    days = zeroAppend(days);
    hours = zeroAppend(hours);
    mins = zeroAppend(mins);
    seconds = zeroAppend(seconds);

    return {'days': days,
            'hours': hours, 
            'mins': mins, 
            'seconds': seconds};
}
function convertSummaryTimeToString(summaryTime) {
    var days = Math.floor(summaryTime / 3600 / 24);
    var totalHours = summaryTime % (3600 * 24);
    var hours = Math.floor(totalHours / 3600);
    var totalSeconds = summaryTime % 3600;
    var mins = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;

    hours = zeroAppend(hours);
    mins = zeroAppend(mins);
    seconds = zeroAppend(seconds);

    if (days > 0)
        return days + 'd ' + hours + 'h ' + mins + 'm ' + seconds + 's';
    else return hours + 'h ' + mins + 'm ' + seconds + 's';
}
function zeroAppend(time) {
    if (time < 10)
        return '0' + time;
    else return time;
}
function treatAsUTC(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
}
function daysBetween(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return ((treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay) + 1;
}
