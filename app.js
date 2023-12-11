const express = require('express');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/post');
const app = express();
const fs = require('fs');
const port = process.env.PORT || 3000;
// Import parser function
const parseDataForNotion = require('./utils/notionDataParser');

app.use(bodyParser.json());

// Use the postRoutes for any requests to '/receive-gpt-data'
app.use('/receive-gpt-data', (req, res, next) => {
    console.log('Received data:', req.body)
    req.parsedData = parseDataForNotion(req.body);
    next();
}, postRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});