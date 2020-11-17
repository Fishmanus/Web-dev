
    function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

let getWeekEnd = function (str) {
    let Day = str
    let parsedDate = new Date(Day)
    if (parsedDate.getDay() === 6 || parsedDate.getDay() === 0)
        return false
    else return true
}

let findLongestWord = function (string) {
    let lonestWord = string.split(' ').sort(function (firstEl, secondEl) {
        return secondEl.length - firstEl.length
    })
    return lonestWord[0]
}

    module.exports.findLongestWord = findLongestWord
    module.exports.getWeekEnd = getWeekEnd
    module.exports.sleep = sleep