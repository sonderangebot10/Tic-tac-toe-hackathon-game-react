const express = require('express')
const fetch = require("node-fetch")
const bodyParser = require('body-parser');
const app = express()
var cors = require('cors')

const port = 3002

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

app.post('/', (req, res) => {
    let params = req.body;
    console.log(params);
    
    let cell = 4; //best one

    while(params.board[cell] != 0 && params.board.includes(0)) {
        cell = Math.floor((Math.random() * 9));
    }

    res.json({cell: cell})
})

// [0, 1, 2]
// [3, 4, 5]
// [6, 7, 8]

app.listen(port, () => console.log(`Example app listening on port ${port}!`))