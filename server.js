let express = require('express');
let app = express();
let fs = require('fs');
let bodyParser = require("body-parser");
let marked = require('marked');
let shortcode = require('shortcode-parser');
let shortcodes = require(__dirname+'/public/shortcodes.js')();


// use public folder
app.use(express.static('public'));

// for post 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// index
app.get("/", function (req, res) {
    res.sendFile(__dirname+'/views/index.html');
});
// preview
app.get("/preview", function (req, res) {
    res.sendFile(__dirname+'/views/preview.html');
});
// render
app.post("/render", function (req, res) {
  let data = marked(req.body.html).replace(/&#39;/g,'"');
  let result = shortcode.parse(data);
  res.send(result);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
