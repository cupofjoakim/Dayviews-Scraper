Dayviews-Scraper
================

A scraper that downloads all the posts from a non-password-protected dayviews (formerly known as bilddagboken) account.

## Dependencies
There's only one major dependency for this script: [PhantomJS][http://phantomjs.org/]. Make sure to install it, otherwise nothing's going to run.

## Usage
1. Run "phantomjs scrape.js http://dayviews.com/username/firstImageId/" from your terminal. Make sure that you're standing in the right folder.

## Known issues
* The script gives a typeerror on some pageloads when evaluating a third party ad script.
* The script sometimes mistake a facebook (or casumo) js-url for the actual image we want. No worries - the script will try again. 
