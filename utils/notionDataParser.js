const fs = require('fs');
const path = require('path');
// Parser function to handle the JSON data received via the POST endpoint
function parseDataForNotion(dataFromGPT) {
    let dataTemplate;
    // Read the template file
    const templatePath = path.join(__dirname, 'template.json');
    const jsonFile = fs.readFileSync(templatePath, 'utf8');
    dataTemplate = JSON.parse(jsonFile);
    // Modify the data accordingly
    dataTemplate.properties.entry_title.title[0].text.content = dataFromGPT.title;
    dataTemplate.properties.tags.multi_select[0].name = dataFromGPT.tags.content;
    dataTemplate.properties.entry_date.date.start = dataFromGPT.entry_date.content;
    dataTemplate.children[0].type = dataFromGPT.content.block_1.format;
    dataTemplate.children[0].heading_1.rich_text[0].text.content = dataFromGPT.content.block_1.content;
    dataTemplate.children[1].type = dataFromGPT.content.block_2.format;
    dataTemplate.children[1].paragraph.rich_text[0].text.content = dataFromGPT.content.block_2.content;
    // dataTemplate.properties.entry_title.title[0].text.content = dataFromGPT.title
    const dataForNotion = dataTemplate;
    // Return the Notion API-ready data
    return dataForNotion;
    // return dataTemplate;
};

module.exports = parseDataForNotion;