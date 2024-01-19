const axios = require('axios');


function postToNotion(data, integrationKey) {
    return axios.post('https://api.notion.com/v1/pages/', data, {
        headers: {
            'Authorization': `Bearer ${integrationKey}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
        }
    })
};

module.exports = postToNotion;