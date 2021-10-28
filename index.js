const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();


//use middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Welcome to tourism server')
})

app.listen(port, () => {
    console.log('Running tourism server', port)
})