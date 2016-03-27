var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Colenso Project' });
});

router.get('/addDocument', function(req, res) {
  res.render('addDocument', { title: 'Colenso Project >> Add Document' });

});

router.get('/exploreAuthor', function(req, res) {
  res.render('exploreAuthor', { title: 'Colenso Project >> Explore Author' });
});

router.get('/exploreDocType', function(req, res) {
  res.render('exploreDocType', { title: 'Colenso Project >> Explore Document Type' });
});

router.get('/search', function(req, res) {
	res.render('search', { title: 'Colenso Project >> Search', content: req.query.searchString });
});
function homepage(){
	window.location= "index.html"
}

function addDoc(){
		window.location.href = "/addDocument"
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
		window.location.href = "http://www.williamcolenso.co.nz/"
}

module.exports = router;
