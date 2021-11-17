# WalletWatcher
Chrome Extension that will check and see if a token has been added/removed from your wallet, will throw a notification when something changes

This extension uses your wallet address and communicates via OpenSea's public API to determine if you're number of assets has changed (gone up or gone down). This does not pass data anywhere and your assests are not touched. Your information is not shared with anyone.

All API calls made are via OpenSea's NFT API (https://docs.opensea.io/reference/api-overview).

This extension DOES NOT use an API Key so it will be rate limited. This could come into play if you set your polling interval to be too tight (i.e. if you have it polling every 10 seconds you're likely to get stopped as a DDOS attack). The default setting of 10 minutes is recommended.

## Installation Instructions
***Note:*** These are manual installation instructions since this is not a published extension, they are non-invasive and you can easily remove the extension if you're not comforable with it.