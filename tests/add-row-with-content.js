const { Client } = require('@notionhq/client');

const fs = require('fs');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const axios = require('axios');

let data_structure;

// Read in the structure data file
try {
    // Synchronously read the file
    const json_file = fs.readFileSync('./dev_diary_entry_2023_12_10.json', 'utf8');
    data_structure = JSON.parse(json_file);
    // console.log(data_structure.emoji);
    // Work with your JSON object here
} catch (err) {
console.error("Error:", err);
}

const data = {
    parent: {
        database_id: "618a8b62c258445dab5ade7dcfc0a518"
    },
    icon: {
        emoji: data_structure.emoji
    },
    cover: {
        external: {
            url: data_structure.photo_url
    
        }
    },
    properties: {
        entry_title: {
            title: [
                {
                    text: {
                        content: data_structure.title
                    }
                }
            ]
        },
        tags: {
            multi_select: [
                {
                    name: data_structure.tags.content 
                }
            ]
        },
        entry_date: {
            date: {
                start: data_structure.entry_date.content
            }
        }
    },
    children: [
        {
            object: "block",
            type: data_structure.content.block_1.format,
            heading_1: {
                rich_text: [
                    {
                        type: "text", 
                        text: {
                            content: data_structure.content.block_1.content 
                        } 
                    }
                ]
            }
        },
        {
            object: "block",
            type: data_structure.content.block_2.format,
            paragraph: {
                rich_text: [
                    {
                        type: "text",
                        text: {
                            content: data_structure.content.block_2.content
                        }
                    }
                ]
            }
        }
    ]
};

axios.post('https://api.notion.com/v1/pages/', data, {
    headers: {
        'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
    }
})
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error('Error:', error);
});
