

let findLongestWord = function (string) {
    let lonestWord = string.split(' ').sort(function (firstEl, secondEl) {
        return secondEl.length - firstEl.length })
    return lonestWord[0]
}

module.exports.findLongestWord = findLongestWord