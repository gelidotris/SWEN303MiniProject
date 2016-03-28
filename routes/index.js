var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

var express = require('express');
var router = express.Router();

var xmlFilePath = this.href;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Colenso Project' });
});

router.get('/addDocument', function(req, res) {
  res.render('addDocument', { title: 'Add Document' });

});

router.get('/exploreAuthor', function(req, res) {
  res.render('exploreAuthor', { title: 'Colenso Project >> Explore Author' });
});

router.get('/exploreDocType', function(req, res) {
  res.render('exploreDocType', { title: 'Colenso Project >> Explore Document Type' });
});

router.get('/search', function(req, res) {
	var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
	"for $x in (collection('Colenso')) where $x[contains(.,'"+req.query.searchString+"')] return(<li><a href='/displayDocument'>{$x//title/text()}</a></li>)";
	xmlFilePath = "for $x in (collection('Colenso')) where $x[contains(.,'"+req.query.searchString+"')] return(<li><a href='/displayDocument'>{$x//title/text()}</a></li>)";

	client.execute(query,
	function (error, result) {
		if(error){ console.error(error);}
		else {
			res.render('search', { title: 'Search Results', search_results: result.result, search_Text: req.query.searchString});
			console.log("RESULT");
			}
		}
		);

});

router.get('/displayDocument', function(req, res) {
	var docu = doc('Colenso/'+ xmlFilePath + ')';
	var query = "XQUERY declare namespace tei='http://www.tei-c.org/ns/1.0'; " +
	String(docu);
	client.execute(query,
	function (error, result) {
		if(error){ console.error(error);}
		else {
			res.render('displayDocument', { title: 'Document', display_doc: result.result});
			console.log("RESULT");
			}
		}
		);
});

router.get('/docType', function(req, res) {
	var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
	"collection('Colenso')//title[contains(.,'Diary')]/text()";
	client.execute(query,
	function (error, result) {
		if(error){ console.error(error);}
		else {
			res.render('docType', { title: 'Colenso Project >> Diaries', document_type: result.result});
			console.log("RESULT");
			}
		}
		);
});

router.get('/browse', function(req, res) {
	var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
		"doc('Colenso/McLean/private_letters/PrLMcL-0024.xml')";
		client.execute(query,
		function (error, result) {
			if(error){ console.error(error);}
			else {
				res.render('browse', { title: 'The Colenso Project', list_letters: result.result });
				console.log("RESULT");
			}
		}
		);
});

module.exports = router;
