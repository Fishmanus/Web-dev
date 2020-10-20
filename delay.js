
module.exports.timeKiller = timeKiller

function delay(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms)
    })
}


let timeKiller = function (ms){
    delay(ms).then (() => ('You lost ' + ms + ' ms'))
}