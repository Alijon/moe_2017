var request = require('request'), 
	cheerio = require('cheerio');
var fs = require('fs');
var $rdf = require('rdflib');
var async = require('async');

var urls = [
	'http://nanojournal.ifmo.ru/en/articles-2/volume8/8-1/mathematics/paper01/',
	'http://nanojournal.ifmo.ru/en/articles-2/volume8/8-1/mathematics/paper02/',
	'http://nanojournal.ifmo.ru/en/articles-2/volume8/8-1/mathematics/paper03/',
	'http://nanojournal.ifmo.ru/en/articles-2/volume8/8-1/mathematics/paper04/',
	'http://nanojournal.ifmo.ru/en/articles-2/volume8/8-1/mathematics/paper05/',
	'http://nanojournal.ifmo.ru/en/articles-2/volume8/8-1/mathematics/paper06/',
	'http://nanojournal.ifmo.ru/en/articles-2/volume8/8-1/mathematics/paper07/',
	'http://nanojournal.ifmo.ru/en/articles-2/volume8/8-1/physics/paper08/',
	'http://nanojournal.ifmo.ru/en/articles-2/volume8/8-1/physics/paper09/',
	'http://nanojournal.ifmo.ru/en/articles-2/volume8/8-1/physics/paper10/',
	'http://nanojournal.ifmo.ru/en/articles-2/volume8/8-1/physics/paper11/',
	'http://nanojournal.ifmo.ru/en/articles-2/volume8/8-1/physics/paper12/',
	'http://nanojournal.ifmo.ru/en/articles-2/volume8/8-1/physics/paper13/',
	'http://nanojournal.ifmo.ru/en/articles-2/volume8/8-1/physics/paper14/',
	'http://nanojournal.ifmo.ru/en/articles-2/volume8/8-1/physics/paper15/',
	'http://nanojournal.ifmo.ru/en/articles-2/volume8/8-1/physics/paper16/',
	'http://nanojournal.ifmo.ru/en/articles-2/volume8/8-1/physics/paper17/',
	'http://nanojournal.ifmo.ru/en/articles-2/volume8/8-1/chemistry/paper18/',
	'http://nanojournal.ifmo.ru/en/articles-2/volume8/8-1/chemistry/paper19/',
];

var articles = [];

async.forEachOf(urls, function(url, key, callback) {
	request({uri: url, method:'GET', encoding:'binary'}, function (err, res, page) {
	    //Передаём страницу в cheerio
	    var $=cheerio.load(page);
	    
	    //Идём по DOM-дереву обычными CSS-селекторами
	    title=$('div.entry-content > p > strong').text();
	    author=$('div.entry-content > p:nth-child(3) ').text();
	    content=$('div.entry-content > p:nth-child(4)').text();
	    keyword= $('div.entry-content > p:nth-child(5)').text().replace("Keywords: ", "");;
	    pdf= $('div.entry-content > p:nth-child(8) > a').attr('href');
	    
	    var article = [
	    	"description": content,
			"title": title,
			"annotation_path": url,
			"keywords_codes": keyword,
			"article_url": pdf,
			"authors": author
	    ]
	    articles.push(article);
	});
	
	callback();

}, function(err) {
    if(err) {
    	console.log(err);
    } else {
    	console.log('success');
    }
});

JSON.stringify(articles);