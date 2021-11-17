// Data we'll need
let walletAddress;
let lastTimeStamp;
let currentTimeStamp;
let lastNumberTokens;
let currentNumberTokens = null;
let intervalInMs;

// We need something to be able to stop the interval we may be running on.
let timerId;

// Retrieve startup data before we start on an interval (we may not have it so this is a safety catch)
function setNeededValues(){
    walletAddress = chrome.storage.sync.get("walletAddress");
    intervalInMs = chrome.storage.sync.get("intervalInMs");
}

// function that checks to see if the wallet address has been changed in settings
function checkAndUpdateWalletAddress(){
    if (walletAddress != chrome.storage.sync.get("walletAddress")){
        walletAddress = chrome.storage.sync.get("walletAddress");
    }
}

// Function that checks the interval is still the same as what it was and if necessary restarts the check on it's new interval
function checkAndUpdateTimerInterval(){
    if (intervalInMs != chrome.storage.sync.get("intervalInMs")) {
        console.log("Stopping check to set new time interval...")
        clearInterval(timerId);
        intervalInMs = chrome.storage.sync.get("intervalInMs");
        console.log("Starting check on new interval of %s ms", intervalInMs);
        timerId = setInterval(checkWalletOnIntervalAndUpdateExtensionData, intervalInMs);
    }
}

// Startup function
function startUp(){
    // set any needed values at startup
    setNeededValues();
    // start our extensions code on an interval
    timerId = setInterval(checkWalletOnIntervalAndUpdateExtensionData(), intervalInMs);
}

// We need an async function to query OpenSea's APIs to get the list of assets in your wallet. Will return number of assets in wallet
// WARNING: This is rate limited as we currently do not have an API Key
async function updateWalletAssetsFromOpenSea(){
    const options = {method: 'GET'};
    fetch(`https://api.opensea.io/api/v1/assets?order_direction=desc&offset=0&owner=${walletAddress}`, options).then(response => {
        if (response.ok) {
            const jsonResponse = response.json();
            return jsonResponse 
        }
    }).then((jsonResponse) => {
        return jsonResponse.assets.length;
    }).catch((error) => {
        console.error("Something went wrong with the API call");
    });
}

// We need this to schedule the check to run on an interval, as part of this if needed we will fire a notification.
function checkWalletOnIntervalAndUpdateExtensionData(){
    // Load previous data and Call OpenSea and perform our checks
    lastTimeStamp = chrome.storage.sync.get("currentTimeStamp");
    lastNumberTokens = chrome.storage.sync.get("currentNumberTokens");
    currentTimeStamp = + new Date();
    currentNumberTokens = updateWalletAssetsFromOpenSea();

    // If the number of tokens in the wallet has changed fire a browser notification
    if (lastNumberTokens != currentNumberTokens){
        chrome.notifications.create('WALLET_UPDATE_ALERT', {
            type: 'basic',
            iconUrl: 'images/wallet48.png',
            title: 'Number of Tokens in Wallet Changed',
            message: `The number of Tokens in your wallet has changed. Was: ${lastNumberTokens}. Now: ${currentNumberTokens}.`,
            priority: 2,
            eventTime: Date.now()
        });
    }

    // Update stored values for last/current timestamps and last/current number of tokens (even if they're the same)
    chrome.storage.sync.set({ currentTimeStamp });
    chrome.storage.sync.set({ currentNumberTokens });

    // Check to see if wallet address has been changed via settings during this interval
    checkAndUpdateWalletAddress();

    // Check to see if the timer interval has been changed
    checkAndUpdateTimerInterval();
}

// Does a check on install to see if the user has used the extension before and will either load the wallet address or take them to settings to enter their 
// wallet address
chrome.runtime.onInstalled.addListener(() => {
    // Set default time for interval to 10 minutes
    intervalInMs = 600000;
    chrome.storage.sync.set({ intervalInMs });

    // Set a default wallet address of 0x0 to avoid problems
    walletAddress = "0x0";
    chrome.storage.sync.set({ walletAddress });

    // Assume on install we need to get a wallet address
    console.warn("No wallet address detected, launching settings page...");
    // Launch the settings page of the extension
    chrome.tabs.create({url: "options.html"}, function (tab) {
        console.log("This is the first load of the extension, opening Options page to fill in required info.");
    });

    startUp();
});

// What to do on browser startup
chrome.runtime.onStartup.addListener(() => {
    startUp();
});

