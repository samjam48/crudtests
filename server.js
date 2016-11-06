const express      = require('express');
const bodyParser   = require('body-parser')

require("./db")
require("./models/people")


const app  = express();

// parse incoming data from forms in post requests to an object
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(require('./controllers/people'))

app.listen(3000, function() {
    console.log('listening on 3000');
})

module.exports = app