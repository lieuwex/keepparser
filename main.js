#!/usr/bin/env node

var cheerio = require('cheerio');
var glob = require('glob');
var fs = require('fs');

function parseNote (html) {
	var $ = cheerio.load(html);

	const title = $('.title').text() || undefined;
	const date = new Date($('.heading').text());

	var $content = $('.content');
	var $listitems = $content.children('.listitem');
	let entries;
	if ($listitems.length > 0) {
		entries = $listitems
			.toArray()
			.map(x => {
				x = $(x);
				return {
					type: 'checkbox',
					content: x.children('.text').text(),
					done: x.hasClass('checked'),
				};
			});
	} else {
		entries = $content.html()
			.split(/<br>/)
			.filter(x => x)
			.map(text => ({
				type: 'text',
				content: text,
			}));
	}

	return {
		title,
		date,
		entries,
		content: $('.content').html(),
	};
}

var items = glob.sync('*.html').map(fname => {
	var html = fs.readFileSync(fname);
	return parseNote(html);
})
console.log(JSON.stringify(items));
