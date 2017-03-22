var request = require('request'), 
	cheerio = require('cheerio');
var fs = require('fs');
var $rdf = require('rdflib');
var async = require('async');

var urls = [
	'http://opticjourn.ru/vipuski/1279-opticheskij-zhurnal-tom-83-01-2016.html',
	'http://opticjourn.ru/vipuski/1295-opticheskij-zhurnal-tom-83-02-2016.html',
	'http://opticjourn.ru/vipuski/1308-opticheskij-zhurnal-tom-83-03-2016.html',
	'http://opticjourn.ru/vipuski/1322-opticheskij-zhurnal-tom-83-04-2016.html',
	'http://opticjourn.ru/vipuski/1349-opticheskij-zhurnal-tom-83-06-2016.html',
	'http://opticjourn.ru/vipuski/1361-opticheskij-zhurnal-tom-83-07-2016.html',
	'http://opticjourn.ru/vipuski/1376-opticheskij-zhurnal-tom-83-08-2016.html',
	'http://opticjourn.ru/vipuski/1389-opticheskij-zhurnal-tom-83-09-2016.html',
	'http://opticjourn.ru/vipuski/1403-opticheskij-zhurnal-tom-83-10-2016.html',
	'http://opticjourn.ru/vipuski/1418-opticheskij-zhurnal-tom-83-11-2016.html',
	'http://opticjourn.ru/vipuski/1433-opticheskij-zhurnal-tom-83-12-2016.html',
	'http://opticjourn.ru/vipuski/1082-opticheskij-zhurnal-tom-82-01-2015.html',
	'http://opticjourn.ru/vipuski/1097-opticheskij-zhurnal-tom-82-02-2015.html',
	'http://opticjourn.ru/vipuski/1125-opticheskij-zhurnal-tom-82-03-2015.html',
	'http://opticjourn.ru/vipuski/1139-opticheskij-zhurnal-tom-82-04-2015.html',
	'http://opticjourn.ru/vipuski/1151-opticheskij-zhurnal-tom-82-05-2015.html',
	'http://opticjourn.ru/vipuski/1164-opticheskij-zhurnal-tom-82-06-2015.html',
	'http://opticjourn.ru/vipuski/1178-opticheskij-zhurnal-tom-82-07-2015.html',
	'http://opticjourn.ru/vipuski/1193-opticheskij-zhurnal-tom-82-08-2015.html',
	'http://opticjourn.ru/vipuski/1206-opticheskij-zhurnal-tom-82-09-2015.html',
	'http://opticjourn.ru/vipuski/1222-opticheskij-zhurnal-tom-82-10-2015.html',
	'http://opticjourn.ru/vipuski/1235-opticheskij-zhurnal-tom-82-11-2015.html',
	'http://opticjourn.ru/vipuski/1266-opticheskij-zhurnal-tom-82-12-2015.html',
	'http://opticjourn.ru/vipuski/910-opticheskij-zhurnal-tom-81-01-2014.html',
	'http://opticjourn.ru/vipuski/921-opticheskij-zhurnal-tom-81-02-2014.html',
	'http://opticjourn.ru/vipuski/934-opticheskij-zhurnal-tom-81-03-2014.html',
	'http://opticjourn.ru/vipuski/961-opticheskij-zhurnal-tom-81-03-2014.html',
	'http://opticjourn.ru/vipuski/1011-opticheskij-zhurnal-tom-81-08-2014.html',
	'http://opticjourn.ru/vipuski/1025-opticheskij-zhurnal-tom-81-09-2014.html',
	'http://opticjourn.ru/vipuski/1040-opticheskij-zhurnal-tom-81-10-2014.html',
	'http://opticjourn.ru/vipuski/1055-opticheskij-zhurnal-tom-81-11-2014.html',
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