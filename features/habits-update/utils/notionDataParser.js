const fs = require('fs');
const path = require('path');

// Parser function to handle the JSON data received via the POST endpoint
function parseDataForNotion(dataFromGPT) {
    // Modify the data accordingly
    const dataForNotion = dataFromGPT.properties;
    // Return the Notion API-ready data
    return dataForNotion;
    // return dataTemplate;
};

module.exports = parseDataForNotion;