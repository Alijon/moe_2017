var request = require('request'), 
	cheerio = require('cheerio');
var fs = require('fs');
var $rdf = require('rdflib');
var async = require('async');

var RDF = $rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#")
var RDFS = $rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#")
var FOAF = $rdf.Namespace("http://xmlns.com/foaf/0.1/")
var XSD = $rdf.Namespace("http://www.w3.org/2001/XMLSchema#")

var store = new $rdf.IndexedFormula();

var urls = [
	'http://nanojournal.ifmo.ru/news/%D0%BC%D0%B8%D0%BD%D0%BE%D0%B1%D1%80%D0%BD%D0%B0%D1%83%D0%BA%D0%B8-%D1%80%D0%B0%D0%B7%D1%8A%D1%8F%D1%81%D0%BD%D0%B8%D0%BB-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D1%8E-%D1%81-web-of-science/',
	'http://nanojournal.ifmo.ru/news/59/',
	'http://nanojournal.ifmo.ru/news/57/',
	'http://nanojournal.ifmo.ru/news/50/',
	'http://nanojournal.ifmo.ru/news/44/',
	'http://nanojournal.ifmo.ru/news/41/',
	'http://nanojournal.ifmo.ru/news/40/',
	'http://nanojournal.ifmo.ru/news/37/',
	'http://nanojournal.ifmo.ru/news/36/',
	'http://nanojournal.ifmo.ru/news/34/',
	'http://nanojournal.ifmo.ru/news/33/',
	'http://nanojournal.ifmo.ru/news/28/',
	'http://nanojournal.ifmo.ru/news/26/',
	'http://nanojournal.ifmo.ru/news/21/',
	'http://nanojournal.ifmo.ru/news/17/',
	'http://nanojournal.ifmo.ru/news/16/',
	'http://nanojournal.ifmo.ru/news/10/',
	'http://nanojournal.ifmo.ru/news/7/',
	'http://nanojournal.ifmo.ru/news/5/',
	'http://nanojournal.ifmo.ru/news/3/',
	'http://nanojournal.ifmo.ru/news/1/'
];


async.forEachOf(urls, function(url, key, callback) {
	request({uri: url, method:'GET', encoding:'binary'}, function (err, res, page) {
	    //Передаём страницу в cheerio
	    var $=cheerio.load(page);
	    
	    //Идём по DOM-дереву обычными CSS-селекторами
	    title=$('h1.entry-title').text();
	    date=$('div.entry-meta > a > span.entry-date').text();
	    author=$('div.entry-meta > span.author.vcard > a.url ').text();
	    content=$('div.entry-content').html();
	        
	    var resource  = store.sym('http://example.com/article/' + key);
	    store.add(resource, FOAF('title'), title);
		store.add(resource, FOAF('author'), author);
		store.add(resource, FOAF('date'), $rdf.literal(date, '', XSD('dateTime')));
		store.add(resource, FOAF('content'), content);

		var wstream = fs.createWriteStream('dump.ttl');
		$rdf.serialize(undefined, store, 'dump.ttl', 'application/x-turtle', function(err, str) {
		    if(err) console.log(err);
		    wstream.write(str);
		});
		wstream.end();
	});
	callback();

}, function(err) {
    if(err) {
    	console.log(err);
    } else {
    	console.log('success');
    }
});