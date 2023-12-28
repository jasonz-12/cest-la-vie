const axios = require('axios');
const fs = require('fs');

const startBlockId = 'df94a7d243f14ed887d51b155f82ada1'; // Replace with your actual block ID

// API Call Auth
// axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.NOTION_API_KEY}`;
axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.NOTION_API_KEY_PROD}`;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Notion-Version'] = '2022-02-22';

let blocks = []; // Array to hold the information for each block

async function processBlock(blockId, parentId = null) {
    try {
        const blockResponse = await axios.get(`https://api.notion.com/v1/blocks/${blockId}`);
        const block = blockResponse.data;

        // Build block object
        // Requirements: Block ID, Block Type, Block Title, Block Parent, Block Contents (Contents are tricky).
        // Note: In nested structures, parsing Notion API responses can really benefit from using the "type" key.
        // Logic: If/elses for the content part? Need to get either the title or the first couple of characters in whatever the content is.
        // Usually it's `rich_text` or `title` - but every scenario must be accounted for.
        typeObj = block.type
        let blockObj = {
            id: block.id,
            type: block.type,
            url: block.type === 'child_page' ? `https://www.notion.so/${block.id.replace(/-/g, '')}` : null,
            parent: parentId,
            contents: block[typeObj]
        };
        // .push means append
        blocks.push(blockObj);

        // High level type for the block
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
        
        // Handle the content part here
        // It works so far - but need to handle the `else` part a bit better
        if ("rich_text" in block[typeObj]) {
            blockObj.contents = {"rich_text": block[typeObj]["rich_text"][0].text.content.slice(0, 50)}
        } else if ("title" in block[typeObj]) {
            blockObj.contents = {"title": block[typeObj]["title"]}
        } else {
            blockObj.contents = block[typeObj]
        }

        // Transform to JSON compatible string
        let data = blocks;
        let jsonData = JSON.stringify(data, null, 2);
        
        // Write to JSON file
        fs.writeFile('metadata-structure-template.json', jsonData, (err) => {
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