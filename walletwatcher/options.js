// Save Options
function saveOptions() {
    let currentWalletAddress = document.getElementById('walletAddress').value;
    let currentIntervalInMs = document.getElementById('intervalInMs').value;

    chrome.storage.sync.set({ 
        walletAddress: currentWalletAddress,
        intervalInMs: currentIntervalInMs
    }, function () {
        let docStatus = document.getElementById('status');
        docStatus.textContext = 'Options Saved';
        setTimeout(function() {
            docStatus.textContent = '';
        }, 750);
    });
}

// Restore stored options
function restoreOptions() {
    chrome.storage.sync.get({
        walletAddress,
        intervalInMs
    }, function(items) {
        document.getElementById('walletAddress').value = items.walletAddress;
        document.getElementById('intervalInMs').value = items.intervalInMs;
    });
}

// Wire everything up
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);