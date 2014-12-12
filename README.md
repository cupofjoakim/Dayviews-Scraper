Dayviews-Scraper
================

**PLEASE NOTE THAT THIS SCRAPER IS NOT IN A READY-TO-USE STATE.**

A scraper that downloads all the posts from a non-password-protected dayviews (formerly known as bilddagboken) account.

## Dependencies
There's only one major dependency for this script: [PhantomJS][http://phantomjs.org/]. Make sure to install it, otherwise nothing's going to run.

## Usage
1. You need to specify two things in the code for now - the url for the entry point (the first image uploaded) as well as the username.
2. Run "phantomjs scrape.js" from your terminal. Make sure that you're standing in the right folder.

## Known issues
* The script crashes when a request fails, requiring a restart. This happens every X images. While testing X could be anything from 10 to 200.
