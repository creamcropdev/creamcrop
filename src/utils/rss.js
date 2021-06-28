let Parser = require('rss-parser');

async function parse(feed_url) {
    let parser = new Parser();
    let feed = await parser.parseURL(feed_url);
    return feed
}

exports.parse = parse