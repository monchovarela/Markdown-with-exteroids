let express = require('express');
let app = express();
let fs = require('fs');
let bodyParser = require("body-parser");
let marked = require('marked');
let shortcode = require('shortcode-parser');
let shortcodes = require(__dirname+'/public/javascript/shortcodes.js')();


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

// get templates
app.get("/templates", function (req, res) {
	fs.readdir(__dirname+'/public/templates', (err, files) => {
		let data = [];
		files.forEach(file => {
			data.push(file);
		});
		res.send(JSON.stringify(data));
	})
});

// get templates
app.get("/template", function (req, res) {
	let txt = req.query.template,content;
	let u = __dirname+'/public/templates/'+txt;
	let output = fs.readFileSync(u,'utf8');
	if(output) res.send(output);
	else res.send('Hello world');
});

// render
app.post("/render", function (req, res) {
  let data = marked(req.body.html).replace(/&#39;/g,'"');
  let result = shortcode.parse(data);
  res.send(result);
});

const local = true;
let port = 5000;

if(!local) port = process.env.PORT;

// listen for requests :)
const listener = app.listen(port, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
