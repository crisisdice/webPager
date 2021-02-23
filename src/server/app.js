const express = require('express');
const cors = require('cors');

const app = express();

var corsOptions = {
	origin: 'http://localhost:8081'
};

app.use(cors(corsOptions));

var service = require('./service.js');

var text = service.get();

app.get('/', (req, res) => { 
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(text);
	console.log("handling request GET '/' ");
}).listen(8080);

var connect = require('connect');
var serveStatic = require('serve-static');

var dirName = "..\\pager";

console.log(`directory: ${ dirName }`);

connect()
	.use(serveStatic(dirName))
	.listen(8081, () => console.log('Server running on 8081...'));


