const axios = require('axios');
const fs = require('fs');


const startBlockId = '618a8b62c258445dab5ade7dcfc0a518'; // Replace with your actual block ID

axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.NOTION_API_KEY}`;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Notion-Version'] = '2022-02-22';

let blocks = []; // Array to hold the information for each block

async function processBlock(blockId, parentId = null) {
    try {
        const blockResponse = await axios.get(`https://api.notion.com/v1/blocks/${blockId}`);
        const block = blockResponse.data;

        // Build block object
        let blockObj = {
            id: block.id,
            type: block.type,
            url: block.type === 'child_page' ? `https://www.notion.so/${block.id.replace(/-/g, '')}` : null,
            parent: parentId
        };
        blocks.push(blockObj);

        if (block.type === 'child_database') {
            // Fetch all entries (pages) in the database and get their IDs
            const queryResponse = await axios.post(`https://api.notion.com/v1/databases/${block.id}/query`);
            for (const page of queryResponse.data.results) {
                await processBlock(page.id, block.id);
            }
        } else if (block.type === 'child_page' || block.has_children) {
            // Process children of the page or block
            await processBlockChildren(block.id, block.id);
        }
        let data = blocks;
        let jsonData = JSON.stringify(data, null, 2);

        fs.writeFile('metadata-structure.json', jsonData, (err) => {
        if (err) throw err;
        console.log('Data written to file');
        });
    } catch (error) {
        console.error('Error processing block:', error);
    }
};

async function processBlockChildren(blockId, parentId) {
    try {
        const childrenResponse = await axios.get(`https://api.notion.com/v1/blocks/${blockId}/children`);
        for (const child of childrenResponse.data.results) {
            await processBlock(child.id, parentId);
        }
    } catch (error) {
        console.error('Error getting block children:', error);
    }
};

async function getHierarchy() {
    await processBlock(startBlockId);
    console.log(JSON.stringify(blocks, null, 2)); // Log the JSON structure of blocks
};

getHierarchy();


