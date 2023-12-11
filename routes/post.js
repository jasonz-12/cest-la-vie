const express = require("express");
const router = express.Router();
const postToNotion = require('../utils/notionApi')

// POST endpoint to receive data from GPT
router.post('/', (req, res) => {
    const parsedData = req.parsedData;

    postToNotion(parsedData)
        .then(response => {
            console.log('Notion API Response:', '200 - POST operation successful.');
            res.status(200).send('POST operation successful.'); // First response sent here
        })
        .catch(error => {
            console.error('Error posting to Notion:', error);
            res.status(500).send('Error posting to Notion'); // Potential second response
        });
});


module.exports = router;