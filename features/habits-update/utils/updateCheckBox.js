const { Client } = require('@notionhq/client');
const axios = require('axios');

function addOneDay(dateString) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0]; // Converts back to "YYYY-MM-DD" format
};

// Function to update checkboxes in the database
async function updateCheckboxes(data, databaseId, specificDate, integrationKey) {
    const cutOffDate = addOneDay(specificDate);
    console.log(cutOffDate);
    const notion = new Client({
        auth: integrationKey // Update these later to get it from the parsed Data
    });
    console.log(cutOffDate);
    try {
        // Query the database for pages with the specific date
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                and: [
                    {
                        property: 'createdTime', 
                        created_time: {
                            on_or_after: specificDate
                        }
                    },
                    {
                        property: 'createdTime',
                        created_time: {
                            before: cutOffDate
                        }
                    }
                ]
            }            
        });

        // Iterate over the pages and update the checkbox property
        for (const page of response.results) {
            console.log(page.id);
            await notion.pages.update({
                page_id: page.id,
                properties: data,
            });
        }
        console.log('Database updated successfully.');
    } catch (error) {
        console.error('Error:', error);
    }
};

module.exports = updateCheckboxes;

// Example usage
// const databaseId = '2e2ff61c0e5749d3918594b6cc9cdec5'; // Replace with your database ID
// const specificDate = '2024-01-19';
// updateCheckboxes(databaseId, specificDate);