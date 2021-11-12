/**
 * For use in code, not through CLI.
 */

import { parse } from './parse.js'
import { serve } from './web.js'
import * as fs from 'fs';

import Parser from 'rss-parser';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

function fetch(url) {
    oldlog = console.log
    console.log = function() {}
    try {
        parse(url, 'none')
    } catch (e) {
        console.log = oldlog
        return e.message
    }
    // enable console.log
    console.log = oldlog
}

function host(config=null, dir=null, port=null, host=null, interval=null) {
    if (config == null && dir == null) {
        throw new Error('Must provide either a config file or a directory')
    }
    if (config != null && dir != null) {
        throw new Error('Must provide either a config file or a directory, not both')
    }
    if (port == null) {
        port = 8080
    }
    if (host == null) {
        host = 'localhost'
    }
    if (interval == null) {
        interval = 300000
    }

    if (config != null) {
        // Create .creamcroprc file
        fs.writeFileSync('.creamcroprc', JSON.stringify(config))
        serve('.', port, host, interval)
    }
}

async function latest(stories=10, feed=null, config='file') {
    if (feed == null) {
        if (config == 'file') {
            config = JSON.parse(fs.readFileSync('.creamcroprc'))
        }
        else {
            config = JSON.parse(config)
        }
    }
    else {
        config = {
            feeds: [feed]
        }
    }

    let articles = []

    for (let i = 0; i < config.feeds.length; i++) {
        let feed = config.feeds[i]
        let parser = new Parser()
        let feedData = await parser.parseURL(feed)
        for (let j = 0; j < stories; j++) {
            let item = feedData.items[j]
            articles.push({
                title: item.title,
                url: item.link,
                description: item.contentSnippet,
                date: item.isoDate
            })
        }
    }

    // Sort aricles by date
    articles = articles.sort(function(a, b) {
        if (config.sort) {
          const sortFunc = require(config.sort);
          return sortFunc(a, b);
        }
        else {
          return new Date(b.pubdate) - new Date(a.pubdate);
        }
    })

    // Return list of first x articles in articles
    return articles.slice(0, stories)
}