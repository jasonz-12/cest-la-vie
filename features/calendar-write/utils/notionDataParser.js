const fs = require('fs');
const path = require('path');
// Parser function to handle the JSON data received via the POST endpoint
function parseDataForNotion(dataFromGPT) {
    let dataTemplate;
    // Read the template file
    const templatePath = path.join(__dirname, 'template.json');
    const jsonFile = fs.readFileSync(templatePath, 'utf8');
    dataTemplate = JSON.parse(jsonFile);
    // Debugging
    // Modify the data accordingly
    dataTemplate.properties.event.title[0].text.content = dataFromGPT.event;
    dataTemplate.properties.category.multi_select[0].name = dataFromGPT.category.content;
    dataTemplate.properties.dueDate.date.start = dataFromGPT.dueDate.content;
    dataTemplate.properties.priority.select.name = dataFromGPT.priority.content;
    dataTemplate.parent.database_id = dataFromGPT.database_id;
    dataTemplate.children[0].type = dataFromGPT.content.block_1.format;
    dataTemplate.children[0].heading_1.rich_text[0].text.content = dataFromGPT.content.block_1.content;
    dataTemplate.children[1].type = dataFromGPT.content.block_2.format;
    dataTemplate.children[1].paragraph.rich_text[0].text.content = dataFromGPT.content.block_2.content;
    const dataForNotion = dataTemplate;
    // Return the Notion API-ready data
    return dataForNotion;
    // return dataTemplate;
};

module.exports = parseDataForNotion;