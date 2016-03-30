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
	if (req.query.addDoc){
		client.execute("XQUERY ADD " + req.query.addDoc)
		res.render('addDocument', { title: 'Add Document>>' });
	}
	else {		
		res.render('addDocument', { title: 'Add Document', docAdd: req.query.addDoc});
		console.log("RESULT");}
});

router.get('/exploreDocType', function(req, res) {
	res.render('exploreDocType', { title: 'Colenso Project >> Explore Document Type' });
});

router.get('/search', function(req, res) {
	var queryString = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
	"for $x in (collection('Colenso')) where $x[contains(.,'"+req.query.searchString+"')] let $p := db:path($x) return(<li><a href='/viewDocument?doc={$p}'>{$x//title/text()}</a></li>)";
	
	var stringLogic = "'" + req.query.searchLogic + "'";
	stringLogic = stringLogic.replace(" AND ", '\' ftand \'')
	.replace(" OR ", '\' ftor \'')
	.replace(" NOT ", '\' ftnot \'');

	var queryLogic = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
	" for $t in //TEI[. contains text "+ stringLogic +" using wildcards] let $p := db:path($t) group by $p return <li><a href='/viewDocument?doc={$p}'>{$p}</a></li>";

	var queryMarkup = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';  " + 
	"for $t in "+ req.query.searchMarkup + " let $p := db:path($t) return (<li><a href='/viewDocument?doc={$p}'>{$p}</a></li>)";

	if (req.query.searchString){
		client.execute(queryString,
			function (error, result) {
				if(error){ console.error(error);}
				else {
					res.render('search', { title: 'Search Results', search_results: result.result, search_Text: req.query.searchString});
					console.log("RESULT");
				}
			}
			);
	}
	else if (req.query.searchLogic){
		client.execute(queryLogic,
			function (error, result) {
				if(error){ console.error(error);}
				else {
					res.render('search', { title: 'Search Results', search_results: result.result, search_Text: req.query.searchLogic});
					console.log("RESULT");
				}
			}
			);
	}
	else if (req.query.searchMarkup){
		client.execute(queryMarkup,
			function (error, result) {
				if(error){ console.error(error);}
				else {
					res.render('search', { title: 'Search Results', search_results: result.result, search_Text: req.query.searchMarkup});
					console.log("RESULT");
				}
			}
			);
	}

	else {res.render('search', { title: 'Search Results', search_results: "", search_Text: ""});
	console.log("RESULT");



}
});

router.get('/viewDocument', function(req, res) {
	if(req.query.doc){
		client.execute("XQUERY doc('Colenso/"+req.query.doc+"')", 
			function(error, result){
				if(error){ 
					console.error(error);}
					else {
						res.render('viewDocument', { title: 'Colenso Project', display_doc: result.result, fPath: req.query.doc});
					}
				}
				);
	}
	else {
		res.render('viewDocument', { display_doc: req.query.doc });
	}
});

router.get('/download', function(req, res, next) {
	if(req.query.doc){
		var file = req.query.doc;
		client.execute("XQUERY doc('Colenso/" + file + "')", 
			function(error, result){
				if(error){
					console.error(error);
				}else{				
					res.writeHead(200, {'Content-Disposition': 'attachment; fileName=' + file});
					res.write(result.result);
					res.end('');
				}
			});	
	} else{
		console.log('.....');
	}	
});

router.get('/viewDiaries', function(req, res) {
	var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
	"for $x in (collection('Colenso')) let $p := db:path($x) where count($p[contains(.,'diary')]) > 0 return(<li><a href='/viewDocument?doc={$p}'>{$x//title/text()}</a></li>)";
	client.execute(query,
		function (error, result) {
			if(error){ console.error(error);}
			else {
				res.render('viewDiaries', { title: 'Colenso Project >> Diaries', document_type: result.result});
				console.log("RESULT");
			}
		}
		);
});

router.get('/viewJudgements', function(req, res) {
	var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
	"for $x in (collection('Colenso')) let $p := db:path($x) where count($p[contains(.,'judgements')]) > 0 return(<li><a href='/viewDocument?doc={$p}'>{$x//title/text()}</a></li>)";
	client.execute(query,
		function (error, result) {
			if(error){ console.error(error);}
			else {
				res.render('viewJudgements', { title: 'Colenso Project >> Judgements', document_type: result.result});
				console.log("RESULT");
			}
		}
		);
});

router.get('/viewNewspaperL', function(req, res) {
	var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
	"for $x in (collection('Colenso')) let $p := db:path($x) where count($p[contains(.,'newspaper_letters')]) > 0 return(<li><a href='/viewDocument?doc={$p}'>{$x//title/text()}</a></li>)";
	client.execute(query,
		function (error, result) {
			if(error){ console.error(error);}
			else {
				res.render('viewNewspaperL', { title: 'Colenso Project >> Newspaper Letters', document_type: result.result});
				console.log("RESULT");
			}
		}
		);
});

router.get('/viewPrivateL', function(req, res) {
	var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
	"for $x in (collection('Colenso')) let $p := db:path($x) where count($p[contains(.,'private_letters')]) > 0 return(<li><a href='/viewDocument?doc={$p}'>{$x//title/text()}</a></li>)";
	client.execute(query,
		function (error, result) {
			if(error){ console.error(error);}
			else {
				res.render('viewPrivateL', { title: 'Colenso Project >> Private Letters', document_type: result.result});
				console.log("RESULT");
			}
		}
		);
});

router.get('/viewPublications', function(req, res) {
	var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
	"for $x in (collection('Colenso')) let $p := db:path($x) where count($p[contains(.,'publications')]) > 0 return(<li><a href='/viewDocument?doc={$p}'>{$x//title/text()}</a></li>)";
	client.execute(query,
		function (error, result) {
			if(error){ console.error(error);}
			else {
				res.render('viewPublications', { title: 'Colenso Project >> Publications', document_type: result.result});
				console.log("RESULT");
			}
		}
		);
});


module.exports = router;
