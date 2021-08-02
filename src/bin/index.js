#!/usr/bin/env node

// Local
const metadata = require('../utils/metadata')
const rss = require('../utils/rss')
const web = require('../utils/web')

// Dependencies
const boxen = require('boxen');

function about() {
    console.log(metadata.about)
}

function version() {
    console.log(metadata.version)
}

function help() {
    console.log(
        '-h\n'+
        'Displays the current help message and exists. ALIAS: --help.\n\n'+
        '-a\n'+
        'Displays package info and exits. ALIAS: --about.\n\n'+
        '-v\n'+
        'Displays version number and exits. ALIAS: --version.'
    )
}

if (process.argv[2] == '--help' || process.argv[2] == '-h') {
    console.log(boxen('CreamCrop\n  '+metadata.version, {padding: {left: 10, right: 10, bottom: 0, top: 0}, float: 'center', margin: {'bottom': 1},borderStyle: 'round', borderColor: 'cyan'}))
    help()
}
else if (process.argv[2] == '-v' || process.argv[2] == '--version') {
    version()
}
else if (process.argv[2] == '--about' || process.argv[2] == '-a') {
    about()
}
else if (process.argv[2] == 'fetch') {
    (async () => {  
        let data = await rss.parse(process.argv[3])
        console.log(data)
    })();
}
else if (process.argv[2] == 'serve') {
    (async () => {
        let data = await rss.parse(process.argv[3])
        web.serve(data)
    })();
}
else {
    console.log('There was an error processing your request. Make sure your command was correct:\n')
    help()
}

exports.about = about
exports.version = version
exports.help = help