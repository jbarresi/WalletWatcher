// Start by getting the IDs of table data we're going to change 
let timeStampField = document.getElementById("checkTimeStamp");
let tokenCountField = document.getElementById("currentNumberTokens");

// Returns date formatted as human readable
function formatDateString(datetime) {
    return `${datetime.getFullYear()}-${datetime.getMonth()+1}-${datetime.getDate()} @ ${datetime.getHours()}:${datetime.getMinutes()}:${datetime.getSeconds()}`;
}

function loadData(){
    let currentTimeStamp = chrome.storage.sync.get("currentTimeStamp");
    let currentNumberTokens = chrome.storage.sync.get("currentNumberTokens");

    timeStampField.text = formatDateString(currentTimeStamp);
    tokenCountField.text = currentNumberTokens;
}