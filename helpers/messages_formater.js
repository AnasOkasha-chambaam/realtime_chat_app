const moment = require('moment');

function formatMsg(userName, msg, type = 'bot'){
    return {
        userName,
        msg,
        time: moment().format('dd-MM-yyyy h:mm a'),
        type   
    }
}

module.exports = formatMsg;