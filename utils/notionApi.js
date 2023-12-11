const axios = require('axios');

function postToNotion(data) {
    return axios.post('https://api.notion.com/v1/pages/', data, {
        headers: {
            'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
        }
    })
};

module.exports = postToNotion;