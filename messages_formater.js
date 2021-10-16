const moment = require('moment');

function formatMsg(userName, msg){
    return {
        userName,
        msg,
        time: moment().format('dd-MM-yyyy h:mm a')   
    }
}

module.exports = formatMsg;