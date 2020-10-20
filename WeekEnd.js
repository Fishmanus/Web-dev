let getWeekEnd = function (str) {
    let Day = str
    let parsedDate = new Date (Day)
    if  (parsedDate.getDay() === 6 || parsedDate.getDay() === 0)
        return false
    else return true
}

module.exports.getWeekEnd = getWeekEnd