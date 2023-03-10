const axios = require('axios');
const cheerio = require('cheerio');
const Parse = require('parse/node');

// Initialize the Parse SDK
Parse.initialize('0dyjfXKItbkSKG2YaOxFtUAxkhY98oL3pNd8eSzs', "j8PP6pYFYQ3SBZZCOuUDj2ZGO2zUnlTRRvkjMiUX");
Parse.serverURL = 'https://parseapi.back4app.com/';

// Define the URL of the Big Horn Golf course scorecard
const url = 'https://golfbighorn.ca/scorecard/';

// Define a function to scrape the scorecard data and save it to the database
const scrapeScorecard = async () => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Find the scorecard table and extract the data
    const scorecardTable = $('table.scorecard');
    const headers = [];
    const rows = [];

    // Extract the header row
    scorecardTable.find('thead tr th').each((i, el) => {
      headers.push($(el).text().trim());
    });

    // Extract the data rows
    scorecardTable.find('tbody tr').each((i, el) => {
      const row = {};

      $(el).find('td').each((j, td) => {
        const header = headers[j];
        const value = $(td).text().trim();
        row[header] = value;
      });

      rows.push(row);
    });

    // Save the scorecard data to the database
    const Scorecard = Parse.Object.extend('Scorecard');
    const scorecard = new Scorecard();
    scorecard.set('courseName', 'Big Horn Golf');
    scorecard.set('data', rows);
    await scorecard.save();

    console.log(`Saved scorecard for ${scorecard.get('courseName')}`);

  } catch (error) {
    console.error(`Error scraping ${url}: ${error.message}`);
  }
};

// Scrape the scorecard data and save it to the database
scrapeScorecard();


