#!/usr/bin/env node

// Local
const metadata = require('../utils/metadata')
const rss = require('../utils/rss')
const web = require('../utils/web')

// Dependencies
const boxen = require('boxen');
const yargs = require('yargs')
const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');

const notifier = updateNotifier({
	pkg,
	updateCheckInterval: 1000 * 60 * 60 * 24 * 7 // 1 week
});

if (notifier.update) {
	console.log(`Update available: ${notifier.update.latest}`);
}
function about() {
    console.log(metadata.about)
}

function version() {
    console.log(metadata.version)
}

function parse(url) {
    (async () => {  
        let data = await rss.parse(url)
        console.log(data)
    })();
}

if (process.argv[2] == '--help' && process.argv.length == 2 || process.argv[2] == '-h' && process.argv.length == 2) {
    console.log(boxen('CreamCrop\n  '+metadata.version, {padding: {left: 10, right: 10, bottom: 0, top: 0}, float: 'center', margin: {'bottom': 1},borderStyle: 'round', borderColor: 'cyan'}))
}

yargs
    .scriptName('(creamcrop|cream)')
    .usage('\u001b[1mUsage: $0 <command> [options]\u001b[0m')
    .command({
        command: 'fetch [url]', 
        desc: 'Fetch a feed.',
        builder: (yargs) => {
            yargs.positional('url', {
                type: 'string',
                description: 'The url of the feed to fetch.'
            })
        }, 
        handler: function(argv) {
            parse(argv.url)
        }
    })
    .command({
        command: 'serve [url]',
        desc: 'Serves website from RSS feed',
        builder: (yargs) => {
            yargs.positional('url', {
                type: 'string',
                description: 'The url of the feed to fetch.'
            })
        },
        handler: function(argv) {
            (async () => {
                let data = await rss.parse(argv.url)
                web.serve(data)
            })();
        }
    })
    .command({
        command: 'about',
        desc: 'Displays package info and exits.',
        handler: function() {
            about()
        }
    })
    .command({
        command: '$0',
        handler: function() {
            console.log('No command specified.')
            process.exit(1)
        }
    })
    .check(function(argv) { // check for unknown commands
        let command = argv._[0]
        let commands = [
            'fetch',
            'serve',
            'about',
            '--version',
            '--help'
        ]
        if (commands.includes(command)) {
            return true
        } else if (argv._.length > 0) {
            throw new Error('\u001b[38;5;196mUnknown command: '+command+'\u001b[0m')
        } else {
            return true
        }
    })
    .check(function(argv) { // Check for missing arguments
        if (argv._.length == 0) {
            throw new Error('Missing command')
        } else {
            return true
        }
    })
    .argv


exports.about = about
exports.version = version