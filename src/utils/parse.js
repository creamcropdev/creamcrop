import * as fs from 'fs';
import * as jsonparser from '@creamcropdev/json'
import * as rss from '../utils/rss.js'

function parse(url, type) {
    (async () => { 
        if (type === 'none') {
            try {
                try {
                    await rss.parse('https://github.com/'+url+'.atom') // Check if url is a github repo
                    url = 'https://github.com/'+url+'.atom'
                }
                catch {
                    await rss.parse(url) // Check's if Rss is valid
                }
            }
            catch {
                await jsonparser.parse(url) // Check's if Json is valid
            }
        }
        else if (type === 'rss') {
            await rss.parse(url)
        }
        else if (type === 'json') {
            await jsonparser.parse(url)
        }
        else if (type === 'git') {
            await rss.parse('https://github.com/'+url+'.atom')
            url = 'https://github.com/'+url+'.atom'
        }
        console.log("Valid feed... adding to config")
        if (fs.existsSync('./.creamcroprc')) {
            let rawconfig = fs.readFileSync('./.creamcroprc', 'utf8')
            let config = JSON.parse(rawconfig)
            if (type != 'none') {
                config.feeds.push([url, type])
            }
            else {
                config.feeds.push(url)
            }
            fs.writeFileSync('./.creamcroprc', JSON.stringify(config, null, 2))
        } else {
            let config = {
                feeds: []
            }
            if (type != 'none') {
                config.feeds.push([url, type])
            }
            else {
                config.feeds.push(url)
            }
            fs.writeFileSync('./.creamcroprc', JSON.stringify(config, null, 2))
        }
    })();
}

export { parse }