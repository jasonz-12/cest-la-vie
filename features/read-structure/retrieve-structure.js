const axios = require('axios');
const fs = require('fs');

const startBlockId = 'df94a7d243f14ed887d51b155f82ada1'; // Replace with your actual block ID

function logErrorToFile(error) {
    const timestamp = new Date().toISOString();
    const errorMessage = `[${timestamp}] Error: ${error}\n`;

    fs.appendFile('error-log.txt', errorMessage, (err) => {
        if (err) {
            console.error('Error writing to log file', err);
        }
    });
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function extractTextContents(tableRowContents) {
    return tableRowContents.map(row => 
        row.map(cell => 
            cell.text.content
        )
    );
}



// API Call Auth
// axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.NOTION_API_KEY}`;
axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.NOTION_API_KEY_PROD}`;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Notion-Version'] = '2022-02-22';

let blocks = []; // Array to hold the information for each block
// New set of logs
logErrorToFile("====================================================================================");

async function processBlock(blockId, parentId = null) {
    try {
        const blockResponse = await axios.get(`https://api.notion.com/v1/blocks/${blockId}`);
        const block = blockResponse.data;

        // Build block object
        // Requirements: Block ID, Block Type, Block Title, Block Parent, Block Contents (Contents are tricky).
        // Note: In nested structures, parsing Notion API responses can really benefit from using the "type" key.
        // Logic: If/elses for the content part? Need to get either the title or the first couple of characters in whatever the content is.
        // Usually it's `rich_text` or `title` - but every scenario must be accounted for.
        typeObj = block.type;
        // Show the ID and type
        console.log("Block ID: "+blockId+" Type: "+typeObj);
        const blockContent = JSON.stringify(block[typeObj]); // Adding a `const` is ABSOLUTELY necessary as it will prevent parent-children content conflicts
        let blockObj = {
            id: block.id,
            type: block.type,
            url: block.type === 'child_page' ? `https://www.notion.so/${block.id.replace(/-/g, '')}` : null,
            parent: parentId,
            contents: blockContent
        };

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
        // Details matter
        if (typeObj && JSON.parse(blockContent)) {
            if (JSON.parse(blockContent).hasOwnProperty("title")) {
                    blockObj.contents = {"title": JSON.parse(blockContent).title};
            } else if (JSON.parse(blockContent).hasOwnProperty("rich_text")) {
                // blockObj.contents = {"rich_text": blockContent["rich_text"][0].text.content.slice(0, 50)};
                if (JSON.parse(blockContent).rich_text.length > 0) {
                    if (JSON.parse(blockContent).rich_text.hasOwnProperty("type")) {
                        richTextTypeObj = JSON.parse(blockContent).rich_text[0].type;
                        blockObj.contents = {"rich_text": JSON.parse(blockContent).rich_text[0][richTextTypeObj].content};
                    } else {
                        blockObj.contents = {"rich_text": JSON.parse(blockContent).rich_text[0].text.content};
                    }
                } else {
                    blockObj.contents = {"contents": JSON.parse(blockContent).rich_text};
                }
            } else if (JSON.parse(blockContent).hasOwnProperty("cells")) {
                blockObj.contents = {"contents": await extractTextContents(JSON.parse(blockContent).cells)};
            } else {
                console.log("Neither `rich_text` nor `title` nor `table_row`."+" Type: "+Object.keys(JSON.parse(blockContent)));
                const subTypeObj = Object.keys(JSON.parse(blockContent));
                blockObj.contents = {"contents": JSON.parse(blockContent)};
                // blockObj.contents = {"contents": await extractTextContents(JSON.parse(blockContent).rich_text)};
            }
        } else {
            console.log("ID: "+blockId+" Issue: `"+typeObj+"` not found in API response - or API response has an error:"+block);
            logErrorToFile("ID: "+blockId+" Issue: `"+typeObj+"` not found in API response - or API response has an error."+block);
        };

        // .push means append
        blocks.push(blockObj);

        // Transform to JSON compatible string
        let data = blocks;
        let jsonData = JSON.stringify(data, null, 2);
        
        // Write to JSON file
        fs.writeFile('metadata-structure-template.json', jsonData, (err) => {
        if (err) throw err;
        // console.log('Data written to file');
        });
    } catch (error) {
        console.error('Error processing block: '+blockId);
        logErrorToFile(error);
        logErrorToFile(blockId);
    }
    // Adding a sleep function to avoid too many requests at the same time.
    await sleep(100);
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
    // console.log(JSON.stringify(blocks, null, 2)); // Log the JSON structure of blocks
};

getHierarchy();