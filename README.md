Dayviews-Scraper
================

A scraper that downloads all the posts from a non-password-protected dayviews (formerly known as bilddagboken) account.

## Dependencies
There's only one major dependency for this script: [PhantomJS][http://phantomjs.org/]. Make sure to install it, otherwise nothing's going to run.

## Installation
Installing the Dayviews-Scraper can be super easy, or super hard - it all depends on your experience with the command line and basic sys-admin work. Here are the steps:
1. Install PhantomJS. On windows, this means that you need to download the latest executable from phantomjs.org and adding it to your path variable. On mac, this is easiest done by simply running the following command from your terminal:

    brew update && brew install phantomjs

2. Clone this repo.
3. Run the script like I tell you below in "Usage".

## Usage
1. Run "phantomjs scrape.js http://dayviews.com/username/firstImageId/" from your terminal. Make sure that you're standing in the right folder.

## Known issues
* The script gives a typeerror on some pageloads when evaluating a third party ad script.
* The script sometimes mistake a facebook (or casumo) js-url for the actual image we want. No worries - the script will try again. 
