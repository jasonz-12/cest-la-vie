const express = require("express");
const router = express.Router();
const updateCheckBox = require('../utils/updateCheckBox');

// POST endpoint to receive data from GPT
router.post('/', (req, res) => {
    const parsedData = req.parsedData;
    const integrationKey = req.body.integration_key;
    const databaseId = req.body.database_id;
    const specificDate = req.body.specificDate;
    console.log("specific date: "+specificDate);

    updateCheckBox(parsedData, databaseId, specificDate, integrationKey)
        .then(response => {
            console.log('Notion API Response:', '200 - POST operation successful.');
            res.status(200).send('POST operation successful.'); // First response sent here
        })
        .catch(error => {
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized access:', error);
                res.status(401).send('Unauthorized access to Notion'); // 401 error response
            } else {
                console.error('Error posting to Notion:', error);
                res.status(500).send('Error posting to Notion'); // Other errors
            }
        });

});

module.exports = router;