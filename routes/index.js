var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Colenso Project' });
});

function homepage(){
	window.location= "index.html"
}

function addDoc(){
		window.location = "addDocument.html"
		window.startBasex();
}

function exploreDocType(){
		window.location = "exploreDocType.html"
}

function exploreAuthor(){
		window.location = "exploreAuthor.html"
}

function exploreYear(){
		window.location = "exploreYear.html"
}

function colensoProject(){
		window.location = "http://www.williamcolenso.co.nz/"
}

module.exports = router;
