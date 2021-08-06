const http = require('http');
const fs = require('fs');
const rss = require('./rss');

/**
 * Serve website
 * 
 * @param {Object} dir - Config file directory
*/
async function serve(dir) {
  if (fs.existsSync(dir+'/.creamcroprc') || fs.existsSync(dir+'.creamcroprc')) {
    console.log('Found config file, generating website...')
  }
  else {
    console.log('Directory not found or No Config File: ' + dir);
    process.exit(1);
  }
  let feed = {
    items: []
  };
  
  let config = JSON.parse(fs.readFileSync(dir+'/.creamcroprc'));
  for (var x in config.feeds) {
    let data = await rss.parse(config.feeds[x]);
    for (var fitem in data.items) {
      feed.items.push({
        title: data.items[fitem].title,
        link: data.items[fitem].link,
        feed: data.title,
        feedlink: data.link,
      });
    }
  }

  function format(title, link, feedlink, feed) {
    if (config.format !== undefined) {
      var format = config.format
      format = format.replace(/%title%/g, title);
      format = format.replace(/%link%/g, link);
      format = format.replace(/%feed%/g, feed);
      format = format.replace(/%feedlink%/g, feedlink);
      return format;
    }
    else {
      return `<a href="${link}">${title}</a> from <a href="${feedlink}">${feed}</a>`;
    }
  }

  let html = ''

  if (config.custom !== undefined) {
    console.log('\nParsing custom HTML...');

    let customconf = ''
    if (fs.existsSync(dir+config.custom)) {
      customconf = fs.readFileSync(dir+config.custom, {encoding:'utf8', flag:'r'});
    } 
    else if (fs.existsSync(dir+'/'+config.custom)) {
      customconf = fs.readFileSync(dir+'/'+config.custom, {encoding:'utf8', flag:'r'});
    } 
    else {
      console.log('Custom file not found: ' + dir+config.custom);
      process.exit(1);
    }

    console.log('\nParsing RSS feed(s)...');
    customconf = customconf.replace(/%feed%/g, feed.items.map(item => `
      <li>
        ${format(item.title, item.link, item.feedlink, item.feed)}
      </li>
      `).join('\n'));

    html = customconf
  }

  else {
    console.log('\nParsing RSS feed(s)...\n');
    html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Creamcrop | A cream-of-the-crop, top-of-the-top, slice-and-chop, absolutely minimalist news getter</title>
        </head>
        <body>
          <h1>Your News Feed</h1>
          <sub>Your news feed from creamcrop, the cream-of-the-crop, top-of-the-top, slice-and-chop, absolutely minimalist news getter.</sub>
          <ul>
            ${feed.items.map(item => `
              <li>
                ${format(item.title, item.link, item.feedlink, item.feed)}
              </li>
            `).join('\n')}
          </ul>
        </body>
      </html>
    `;
  }

  const requestListener = function (req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end(html);
  }
  
  const server = http.createServer(requestListener);
  server.listen(8080);
  console.log('\n\nServer running at http://localhost:8080')
}

exports.serve = serve