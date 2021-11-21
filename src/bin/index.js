#!/usr/bin/env node

// Local
import * as metadata from '../utils/metadata.js'
import * as rss from '../utils/rss.js'
import * as web from '../utils/web.js'
import { parse } from '../utils/parse.js'
import { createRequire } from "module";
const require = createRequire(import.meta.url);
let pkg = require("../../package.json");

// Dependencies
import boxen from 'boxen';
let yargs = require('yargs')
import updateNotifier from 'update-notifier';
import * as fs from 'fs';
import * as jsonparser from '@creamcropdev/json'

const notifier = updateNotifier({pkg});

notifier.notify();

function about() {
    console.log(metadata.about)
}

function version() {
    console.log(metadata.version)
}

if (process.argv[2] == '--help' && process.argv.length == 3 || process.argv[2] == '-h' && process.argv.length == 3) {
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
                description: 'The url of the feed to fetch, or if fetching a git repo, Owner/Repo/Type, where `type` is `releases`, `tags`, or `commits`.'
            }),
            yargs.option('type', {
                alias: 't',
                type: 'string',
                description: 'The type of feed. Accepted values are "json", "rss", "git", or "none" for creamcrop to automatically find the type.',
                default: 'none'
            })
        }, 
        handler: function(argv) {
            parse(argv.url, argv.type)
        }
    })
    .command({
        command: 'serve [dir]',
        desc: 'Serves website from config file in [dir].',
        builder: (yargs) => {
            yargs.positional('dir', {
                type: 'string',
                description: 'The directory of the config file.'
            }),
            yargs.option('port', {
                alias: 'p',
                type: 'number',
                default: 8080,
                description: 'The port to run the server on.'
            }),
            yargs.option('host', {
                alias: 'h',
                type: 'string',
                default: 'localhost',
                description: 'The host to run the server on.'
            }),
            yargs.option('interval', {
                alias: 'i',
                type: 'number',
                default: 300000,
                description: 'The interval to check for new posts. Defaults to 5 minutes.'
            })
        },
        handler: function(argv) {
            (async () => {
                await web.serve(argv.dir, argv.port, argv.host, argv.interval)
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

process.on('SIGINT', function() {
    console.log('\nExiting...')
    process.exit(0)
});

export { about, version }